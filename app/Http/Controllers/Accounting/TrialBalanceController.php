<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\JournalEntry;
use App\Models\Account;
use App\Models\JournalLine;

class TrialBalanceController extends Controller
{
    public function index(Request $request)
    {
        // You can keep this policy as "viewAny JournalEntry" (same permission as ledger)
        $this->authorize('viewAny', JournalEntry::class);

        $user = $request->user();

        // Filters
        $from = $request->input('from');     // optional
        $to = $request->input('to');         // optional
        $asOf = $request->input('as_of');    // optional (alternative style)

        // Build base query: tenant-safe, join entries for entry_date filtering
        $query = JournalLine::query()
            ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.journal_entry_id')
            ->join('accounts', 'accounts.id', '=', 'journal_lines.account_id')
            ->where('journal_lines.tenant_id', $user->tenant_id)
            ->where('accounts.tenant_id', $user->tenant_id)
            ->selectRaw('
                accounts.id as account_id,
                accounts.name as account_name,
                accounts.type as account_type,
                COALESCE(SUM(journal_lines.debit), 0) as total_debit,
                COALESCE(SUM(journal_lines.credit), 0) as total_credit
            ')
            ->groupBy('accounts.id', 'accounts.name', 'accounts.type')
            ->orderBy('accounts.type')
            ->orderBy('accounts.name');

        // Filter rules:
        // - If as_of is provided, we treat it as <= as_of
        // - Otherwise use from/to range if provided
        if ($asOf) {
            $query->whereDate('journal_entries.entry_date', '<=', $asOf);
        } else {
            if ($from) {
                $query->whereDate('journal_entries.entry_date', '>=', $from);
            }
            if ($to) {
                $query->whereDate('journal_entries.entry_date', '<=', $to);
            }
        }

        $rows = collect($query->get())->map(function ($r) {
            $debit = (float) $r->total_debit;
            $credit = (float) $r->total_credit;

            return [
                'account_id' => (int) $r->account_id,
                'account_name' => $r->account_name,
                'account_type' => $r->account_type,
                'debit' => $debit,
                'credit' => $credit,
                'net' => $debit - $credit,
            ];
        });

        $totals = [
            'debit' => (float) $rows->sum('debit'),
            'credit' => (float) $rows->sum('credit'),
            'balanced' => abs(((float) $rows->sum('debit')) - ((float) $rows->sum('credit'))) < 0.005,
        ];

        return Inertia::render('Accounting/TrialBalance/Index', [
            'rows' => $rows,
            'totals' => $totals,
            'filters' => [
                'from' => $from,
                'to' => $to,
                'as_of' => $asOf,
            ],
        ]);
    }
}
