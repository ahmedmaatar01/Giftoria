<?php

namespace App\Notifications\Channels;

use App\Notifications\OrderNotification;
use App\Services\FcmService;

class FcmChannel
{
    public function __construct(private FcmService $fcm)
    {
    }

    public function send($notifiable, OrderNotification $notification): void
    {
        if (!$this->fcm->isConfigured()) {
            return;
        }

        foreach ($notifiable->deviceTokens as $device) {
            $message = $notification->toFcm($device->locale);
            $result = $this->fcm->send(
                $device->token,
                $message['title'],
                $message['body'],
                $message['data']
            );

            if ($result === FcmService::STALE_TOKEN) {
                $device->delete();
            }
        }
    }
}
