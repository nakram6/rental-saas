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

    public function lines()
    {
        return $this->hasMany(InvoiceLine::class);
    }
}
