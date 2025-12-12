<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
    'tenant_id',
    'name',
    'email',
    'phone',
    'city',
    'address',
    'notes',
    'status',
    'total_bookings',
    'total_spent',
];


    protected $casts = [
        'total_bookings' => 'integer',
        'total_spent' => 'float',
    ];
}
