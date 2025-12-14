<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\JournalEntry;
use App\Models\Account;
use App\Models\JournalLine;

class GeneralLedgerController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', JournalEntry::class);

        $user = $request->user();

        $accounts = Account::where('tenant_id', $user->tenant_id)
            ->orderBy('name')
            ->get(['id', 'name', 'type']);

        $accountId = $request->input('account_id');
        $from = $request->input('from');
        $to = $request->input('to');

        $lines = collect();
        $openingBalance = 0.0;

        if ($accountId) {

            // 1) Opening Balance: sum(debit-credit) before "from" date
            if ($from) {
                $openingBalance = (float) JournalLine::query()
                    ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.journal_entry_id')
                    ->where('journal_lines.tenant_id', $user->tenant_id)
                    ->where('journal_lines.account_id', $accountId)
                    ->whereDate('journal_entries.entry_date', '<', $from)
                    ->selectRaw('COALESCE(SUM(journal_lines.debit - journal_lines.credit), 0) as bal')
                    ->value('bal');
            }

            // 2) Lines within date range (or all if no range)
            $query = JournalLine::query()
                ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.journal_entry_id')
                ->where('journal_lines.tenant_id', $user->tenant_id)
                ->where('journal_lines.account_id', $accountId)
                ->orderBy('journal_entries.entry_date')
                ->orderBy('journal_lines.id')
                ->select([
                    'journal_lines.id',
                    'journal_lines.journal_entry_id',
                    'journal_lines.debit',
                    'journal_lines.credit',
                    'journal_lines.memo',
                    'journal_entries.entry_date',
                    'journal_entries.memo as entry_memo',
                ]);

            if ($from) {
                $query->whereDate('journal_entries.entry_date', '>=', $from);
            }
            if ($to) {
                $query->whereDate('journal_entries.entry_date', '<=', $to);
            }

            $lines = $query->get()->map(function ($line) {
                return [
                    'id' => $line->id,
                    'journal_entry_id' => $line->journal_entry_id,
                    'debit' => (float) ($line->debit ?? 0),
                    'credit' => (float) ($line->credit ?? 0),
                    'memo' => $line->memo,
                    'journal_entry' => [
                        'date' => $line->entry_date,
                        'description' => $line->entry_memo,
                    ],
                ];
            });
        }

        return Inertia::render('Accounting/GeneralLedger/Index', [
            'accounts' => $accounts,
            'lines' => $lines,
            'opening_balance' => $openingBalance,
            'filters' => [
                'account_id' => $accountId,
                'from' => $from,
                'to' => $to,
            ],
        ]);
    }

    public function export(Request $request)
    {
        $this->authorize('viewAny', JournalEntry::class);

        $user = $request->user();

        $accountId = $request->input('account_id');
        abort_unless($accountId, 422, 'account_id is required');

        $from = $request->input('from');
        $to = $request->input('to');

        $account = Account::where('tenant_id', $user->tenant_id)
            ->where('id', $accountId)
            ->firstOrFail();

        $query = JournalLine::query()
            ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.journal_entry_id')
            ->where('journal_lines.tenant_id', $user->tenant_id)
            ->where('journal_lines.account_id', $accountId)
            ->orderBy('journal_entries.entry_date')
            ->orderBy('journal_lines.id')
            ->select([
                'journal_entries.entry_date',
                'journal_lines.journal_entry_id',
                'journal_lines.memo',
                'journal_entries.memo as entry_memo',
                'journal_lines.debit',
                'journal_lines.credit',
            ]);

        if ($from) {
            $query->whereDate('journal_entries.entry_date', '>=', $from);
        }
        if ($to) {
            $query->whereDate('journal_entries.entry_date', '<=', $to);
        }

        $rows = $query->get();

        $safeName = preg_replace('/[^a-zA-Z0-9_-]+/', '-', $account->name);
        $filename = "general-ledger-{$safeName}.csv";

        return response()->streamDownload(function () use ($rows, $account) {
            $out = fopen('php://output', 'w');

            fputcsv($out, ['Account', $account->name]);
            fputcsv($out, ['Date', 'Journal #', 'Memo/Description', 'Debit', 'Credit']);

            foreach ($rows as $r) {
                $desc = $r->memo ?: $r->entry_memo;

                fputcsv($out, [
                    $r->entry_date,
                    'JE-' . $r->journal_entry_id,
                    $desc,
                    $r->debit,
                    $r->credit,
                ]);
            }

            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv']);
    }
}
