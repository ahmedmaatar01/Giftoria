<?php

namespace App\Observers;

use App\Models\Command;
use App\Models\User;
use App\Notifications\OrderStatusChanged;
use Illuminate\Support\Facades\Log;

class CommandObserver
{
    /**
     * Lives on the model so every path is covered: the admin status route,
     * the order update route, and the Sadad callback and webhook.
     */
    public function updated(Command $command): void
    {
        if (!$command->wasChanged('status')) {
            return;
        }

        // Guest orders have no account to notify
        $user = User::find($command->user_id);
        if (!$user) {
            return;
        }

        try {
            $user->notify(new OrderStatusChanged($command));
        } catch (\Throwable $e) {
            Log::error('Order status notification failed', [
                'command_id' => $command->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
