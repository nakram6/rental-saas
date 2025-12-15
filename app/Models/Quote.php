<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Tenant;
use App\Models\User;



class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id','user_id','quote_no',
        'event_date','city','venue','event_type','guest_count','theme_colors',
        'budget','notes','status',
        'subtotal','tax','total','pdf_path',
    ];

    protected $casts = [
        'event_date' => 'date',
        'budget' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function items()
    {
        return $this->hasMany(QuoteItem::class);
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }


    public function user()
{
    return $this->belongsTo(User::class);
}

}
