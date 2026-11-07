<?php

namespace App\Notifications;

use App\Models\Command;
use App\Notifications\Channels\FcmChannel;
use Illuminate\Notifications\Notification;

abstract class OrderNotification extends Notification
{
    public function __construct(public Command $command)
    {
    }

    /** Stable identifier the mobile app switches on. */
    abstract protected function type(): string;

    abstract protected function title(string $locale): string;

    abstract protected function body(string $locale): string;

    /** Extra fields for the inbox entry and the push data payload. */
    abstract protected function extra(): array;

    public function via($notifiable): array
    {
        return ['database', FcmChannel::class];
    }

    public function toArray($notifiable): array
    {
        return array_merge([
            'type' => $this->type(),
            'command_id' => $this->command->id,
            'title' => ['en' => $this->title('en'), 'ar' => $this->title('ar')],
            'body' => ['en' => $this->body('en'), 'ar' => $this->body('ar')],
        ], $this->extra());
    }

    public function toFcm(string $locale): array
    {
        return [
            'title' => $this->title($locale),
            'body' => $this->body($locale),
            'data' => array_merge([
                'type' => $this->type(),
                'notification_id' => $this->id,
                'command_id' => $this->command->id,
            ], $this->extra()),
        ];
    }
}
