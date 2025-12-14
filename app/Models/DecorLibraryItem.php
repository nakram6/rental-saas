<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DecorLibraryItem extends Model
{
    protected $fillable = [
        'tenant_id',
        'name',
        'type',
        'tag',
        'image_url',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];
}
