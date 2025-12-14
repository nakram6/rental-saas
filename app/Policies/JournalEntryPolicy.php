<?php

namespace App\Policies;

use App\Models\User;
use App\Models\JournalEntry;

class JournalEntryPolicy
{
    public function viewAny(User $user): bool
    {
        return (bool) $user->tenant_id;
    }

    public function view(User $user, JournalEntry $entry): bool
    {
        return $user->tenant_id && $entry->tenant_id === $user->tenant_id;
    }
}
