<?php

namespace App\Notifications;

use App\Models\Command;
use App\Models\OrderNote;
use Illuminate\Support\Str;

class OrderNoteAdded extends OrderNotification
{
    public function __construct(Command $command, public OrderNote $note)
    {
        parent::__construct($command);
    }

    protected function type(): string
    {
        return 'order_note_added';
    }

    protected function title(string $locale): string
    {
        return __('push.note_title', ['id' => $this->command->id], $locale);
    }

    protected function body(string $locale): string
    {
        return Str::limit($this->note->content, 120);
    }

    protected function extra(): array
    {
        return ['note_id' => $this->note->id];
    }
}
