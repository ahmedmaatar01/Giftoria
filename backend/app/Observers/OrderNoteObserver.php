<?php

namespace App\Observers;

use App\Models\Command;
use App\Models\OrderNote;
use App\Models\User;
use App\Notifications\OrderNoteAdded;
use Illuminate\Support\Facades\Log;

class OrderNoteObserver
{
    public function created(OrderNote $note): void
    {
        // Only staff replies the customer can see, never internal notes
        if (!$note->admin_id || !$note->is_visible_to_customer || $note->note_type === 'admin') {
            return;
        }

        $command = Command::find($note->command_id);
        $user = $command ? User::find($command->user_id) : null;
        if (!$user) {
            return;
        }

        try {
            $user->notify(new OrderNoteAdded($command, $note));
        } catch (\Throwable $e) {
            Log::error('Order note notification failed', [
                'note_id' => $note->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
