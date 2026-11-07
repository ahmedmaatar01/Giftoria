<?php

namespace Tests\Unit;

use App\Services\FcmService;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class FcmServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
        config(['services.fcm.credentials' => base64_encode(json_encode([
            'project_id' => 'giftoria-test',
            'client_email' => 'push@giftoria-test.iam.gserviceaccount.com',
            'private_key' => $this->privateKey(),
        ]))]);
    }

    private function privateKey(): string
    {
        // Windows PHP builds need the openssl config passed explicitly
        $config = ['private_key_bits' => 2048];
        $windowsConfig = dirname(PHP_BINARY) . '/extras/ssl/openssl.cnf';
        if (is_file($windowsConfig)) {
            $config['config'] = $windowsConfig;
        }

        $key = openssl_pkey_new($config);
        openssl_pkey_export($key, $pem, null, $config);

        return $pem;
    }

    private function fakeGoogle($fcmResponse): void
    {
        Http::fake([
            'oauth2.googleapis.com/*' => Http::response(['access_token' => 'google-token']),
            'fcm.googleapis.com/*' => $fcmResponse,
        ]);
    }

    public function test_it_signs_in_and_posts_a_v1_message(): void
    {
        $this->fakeGoogle(Http::response(['name' => 'projects/giftoria-test/messages/1']));

        $result = app(FcmService::class)->send('phone', 'Title', 'Body', ['command_id' => 12]);

        $this->assertSame(FcmService::SENT, $result);
        Http::assertSent(function (Request $request) {
            if (!str_contains($request->url(), 'oauth2.googleapis.com')) {
                return false;
            }
            [, $claims, $signature] = explode('.', $request['assertion']);
            $decoded = json_decode(base64_decode(strtr($claims, '-_', '+/')), true);

            return $signature !== ''
                && $decoded['iss'] === 'push@giftoria-test.iam.gserviceaccount.com'
                && $decoded['scope'] === 'https://www.googleapis.com/auth/firebase.messaging';
        });
        Http::assertSent(function (Request $request) {
            return $request->url() === 'https://fcm.googleapis.com/v1/projects/giftoria-test/messages:send'
                && $request->hasHeader('Authorization', 'Bearer google-token')
                && $request['message']['token'] === 'phone'
                && $request['message']['notification']['title'] === 'Title'
                // FCM rejects non-string data values
                && $request['message']['data']['command_id'] === '12';
        });
    }

    public function test_the_google_token_is_reused(): void
    {
        $this->fakeGoogle(Http::response(['name' => 'ok']));

        app(FcmService::class)->send('a', 'T', 'B');
        app(FcmService::class)->send('b', 'T', 'B');

        Http::assertSentCount(3);
    }

    public function test_unregistered_token_is_reported_as_stale(): void
    {
        $this->fakeGoogle(Http::response(['error' => ['status' => 'NOT_FOUND', 'message' => 'Requested entity was not found.']], 404));

        $this->assertSame(FcmService::STALE_TOKEN, app(FcmService::class)->send('dead', 'T', 'B'));
    }

    public function test_malformed_token_is_reported_as_stale(): void
    {
        $this->fakeGoogle(Http::response(['error' => ['message' => 'The registration token is not a valid FCM registration token']], 400));

        $this->assertSame(FcmService::STALE_TOKEN, app(FcmService::class)->send('bad', 'T', 'B'));
    }

    public function test_a_bad_payload_keeps_the_token_and_does_not_throw(): void
    {
        $this->fakeGoogle(Http::response(['error' => ['message' => 'Invalid JSON payload']], 400));

        $this->assertSame(FcmService::FAILED, app(FcmService::class)->send('phone', 'T', 'B'));
    }

    public function test_a_firebase_outage_keeps_the_token_and_does_not_throw(): void
    {
        $this->fakeGoogle(Http::response([], 503));

        $this->assertSame(FcmService::FAILED, app(FcmService::class)->send('phone', 'T', 'B'));
    }

    public function test_a_failed_google_sign_in_does_not_throw(): void
    {
        Http::fake(['oauth2.googleapis.com/*' => Http::response(['error' => 'invalid_grant'], 400)]);

        $this->assertSame(FcmService::FAILED, app(FcmService::class)->send('phone', 'T', 'B'));
    }

    public function test_missing_credentials_are_reported(): void
    {
        config(['services.fcm.credentials' => null]);

        $this->assertFalse(app(FcmService::class)->isConfigured());
    }
}
