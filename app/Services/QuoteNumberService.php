<?php

namespace App\Services;

use App\Models\Quote;
use Illuminate\Support\Str;

class QuoteNumberService
{
    public function next(): string
    {
        // Q-YYYY-XXXXXX
        $year = now()->format('Y');

        $last = Quote::where('quote_no', 'like', "Q-{$year}-%")
            ->orderByDesc('id')
            ->value('quote_no');

        $n = 1;
        if ($last) {
            $parts = explode('-', $last);
            $n = (int)($parts[2] ?? 0) + 1;
        }

        return "Q-{$year}-" . str_pad((string)$n, 6, '0', STR_PAD_LEFT);
    }
}
