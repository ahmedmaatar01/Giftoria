<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FcmService
{
    public const SENT = 'sent';
    public const STALE_TOKEN = 'stale_token';
    public const FAILED = 'failed';

    private const TOKEN_URL = 'https://oauth2.googleapis.com/token';
    private const SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';

    public function isConfigured(): bool
    {
        return $this->credentials() !== null;
    }

    /**
     * Send one push message. Never throws, so a Firebase outage cannot break
     * the request that triggered the notification.
     */
    public function send(string $token, string $title, string $body, array $data = []): string
    {
        try {
            $credentials = $this->credentials();
            if (!$credentials) {
                return self::FAILED;
            }

            $message = [
                'token' => $token,
                'notification' => ['title' => $title, 'body' => $body],
                'android' => ['priority' => 'HIGH', 'notification' => ['sound' => 'default']],
                'apns' => ['payload' => ['aps' => ['sound' => 'default']]],
            ];
            if ($data) {
                // FCM only accepts string values in data
                $message['data'] = array_map('strval', $data);
            }

            $response = Http::withToken($this->accessToken($credentials))
                ->timeout(5)
                ->post("https://fcm.googleapis.com/v1/projects/{$credentials['project_id']}/messages:send", [
                    'message' => $message,
                ]);

            if ($response->successful()) {
                return self::SENT;
            }

            $error = $response->json('error') ?? [];
            if ($this->isStaleToken($response->status(), $error)) {
                return self::STALE_TOKEN;
            }

            Log::error('FCM send failed', ['status' => $response->status(), 'error' => $error]);
        } catch (\Throwable $e) {
            Log::error('FCM send failed', ['error' => $e->getMessage()]);
        }

        return self::FAILED;
    }

    private function isStaleToken(int $status, array $error): bool
    {
        if ($status === 404) {
            return true;
        }

        // A 400 can also mean a bad payload, so only trust it when it names the token
        return $status === 400 && str_contains($error['message'] ?? '', 'registration token');
    }

    private function credentials(): ?array
    {
        $encoded = config('services.fcm.credentials');
        $credentials = $encoded ? json_decode((string) base64_decode($encoded), true) : null;

        return isset($credentials['project_id'], $credentials['client_email'], $credentials['private_key'])
            ? $credentials
            : null;
    }

    private function accessToken(array $credentials): string
    {
        // Google tokens last 60 minutes
        return Cache::remember('fcm.access_token', 3000, function () use ($credentials) {
            return Http::asForm()
                ->timeout(5)
                ->post(self::TOKEN_URL, [
                    'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    'assertion' => $this->signedJwt($credentials),
                ])
                ->throw()
                ->json('access_token');
        });
    }

    private function signedJwt(array $credentials): string
    {
        $now = time();
        $segments = [
            $this->base64Url(json_encode(['alg' => 'RS256', 'typ' => 'JWT'])),
            $this->base64Url(json_encode([
                'iss' => $credentials['client_email'],
                'scope' => self::SCOPE,
                'aud' => self::TOKEN_URL,
                'iat' => $now,
                'exp' => $now + 3600,
            ])),
        ];

        openssl_sign(implode('.', $segments), $signature, $credentials['private_key'], OPENSSL_ALGO_SHA256);
        $segments[] = $this->base64Url($signature);

        return implode('.', $segments);
    }

    private function base64Url(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }
}
