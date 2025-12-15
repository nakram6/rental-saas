<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssistantMessage extends Model
{
    protected $fillable = ['assistant_session_id', 'role', 'content'];

    public function session()
    {
        return $this->belongsTo(AssistantSession::class, 'assistant_session_id');
    }
}
