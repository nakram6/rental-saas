<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\JournalEntry;
use App\Models\JournalLine;
use App\Models\Account;

class JournalEntryController extends Controller
{
    public function show(Request $request, JournalEntry $journalEntry)
    {
        // Tenant safety
        $user = $request->user();
        abort_unless($user && $user->tenant_id, 403);
        abort_unless($journalEntry->tenant_id === $user->tenant_id, 403);

        // Optional: authorization
        $this->authorize('view', $journalEntry);

        $lines = JournalLine::query()
            ->join('accounts', 'accounts.id', '=', 'journal_lines.account_id')
            ->where('journal_lines.tenant_id', $user->tenant_id)
            ->where('journal_lines.journal_entry_id', $journalEntry->id)
            ->orderBy('journal_lines.id')
            ->select([
                'journal_lines.id',
                'journal_lines.debit',
                'journal_lines.credit',
                'journal_lines.memo',
                'accounts.name as account_name',
                'accounts.type as account_type',
            ])
            ->get()
            ->map(fn ($l) => [
                'id' => $l->id,
                'account_name' => $l->account_name,
                'account_type' => $l->account_type,
                'memo' => $l->memo,
                'debit' => (float) ($l->debit ?? 0),
                'credit' => (float) ($l->credit ?? 0),
            ]);

        $totals = [
            'debit' => (float) $lines->sum('debit'),
            'credit' => (float) $lines->sum('credit'),
        ];

        return Inertia::render('Accounting/JournalEntries/Show', [
            'entry' => [
                'id' => $journalEntry->id,
                'entry_date' => $journalEntry->entry_date,
                'memo' => $journalEntry->memo,
                'reference_type' => $journalEntry->reference_type,
                'reference_id' => $journalEntry->reference_id,
                'created_at' => $journalEntry->created_at,
            ],
            'lines' => $lines,
            'totals' => $totals,
        ]);
    }
}
