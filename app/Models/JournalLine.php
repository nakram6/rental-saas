<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalLine extends Model
{
    protected $fillable = [
        'tenant_id',
        'journal_entry_id',
        'account_id',
        'customer_id',
        'booking_id',
        'debit',
        'credit',
        'memo',
        'description',
    ];

    public function entry()
    {
        return $this->belongsTo(JournalEntry::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
