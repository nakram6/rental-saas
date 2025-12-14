<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalEntry extends Model
{
    protected $fillable = [
        'tenant_id',
        'entry_date',
        'reference_type',
        'reference_id',
        'memo',
        'posted_by',
    ];

    protected $casts = [
        'entry_date' => 'date',
    ];

    public function lines()
    {
        return $this->hasMany(JournalLine::class);
    }
}
