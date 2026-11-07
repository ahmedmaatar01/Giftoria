<?php

namespace App\Notifications;

use Illuminate\Support\Facades\Lang;

class OrderStatusChanged extends OrderNotification
{
    protected function type(): string
    {
        return 'order_status_changed';
    }

    protected function title(string $locale): string
    {
        return __('push.status_title', ['id' => $this->command->id], $locale);
    }

    protected function body(string $locale): string
    {
        // Status is free text in the API, so unknown values get a generic message
        $key = 'push.status.' . strtolower((string) $this->command->status);

        return Lang::has($key, $locale, false)
            ? __($key, [], $locale)
            : __('push.status_default', [], $locale);
    }

    protected function extra(): array
    {
        return ['status' => $this->command->status];
    }
}
