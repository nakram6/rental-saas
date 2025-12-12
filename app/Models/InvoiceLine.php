<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceLine extends Model
{
    protected $fillable = [
        'tenant_id',
        'invoice_id',
        'category',
        'description',
        'qty',
        'unit_price',
        'line_total',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
