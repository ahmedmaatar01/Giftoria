<?php

namespace App\Mail;

use App\Models\Command;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Carbon;

class AdminCommandNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Command $command;

    public function __construct(Command $command)
    {
        // Preload relationships needed in view to avoid N+1
        $command->loadMissing(['commandProducts.product', 'giftCardTemplate']);
        $this->command = $command;
    }

    public function build()
    {
        return $this
            ->subject('New Order #' . $this->command->id . ' Received')
            ->markdown('emails.admin_command_notification', [
                'command' => $this->command,
            ]);
    }
}
