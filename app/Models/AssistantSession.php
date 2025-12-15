<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssistantSession extends Model
{
    protected $fillable = ['tenant_name', 'source'];

    public function messages()
    {
        return $this->hasMany(AssistantMessage::class);
    }
}
