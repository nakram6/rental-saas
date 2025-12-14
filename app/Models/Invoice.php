<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'tenant_id',
        'customer_id',
        'booking_id',
        'invoice_no',
        'issue_date',
        'due_date',
        'subtotal',
        'discount',
        'tax',
        'total',
        'status',
        'notes',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date'   => 'date',
    ];

    /* ---------------- Relationships ---------------- */

    public function lines()
    {
        return $this->hasMany(InvoiceLine::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /* ---------------- Business rules ---------------- */

    /**
     * Paid invoices are locked and cannot be modified.
     */
    public function isLocked(): bool
    {
        return $this->status === 'paid';
    }
}
