<?php

namespace Tests\Feature;

use App\Models\DeviceToken;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    private function user(): User
    {
        return User::create([
            'name' => 'Sara',
            'email' => 'sara@example.com',
            'password' => Hash::make('old-password'),
        ]);
    }

    public function test_known_and_unknown_emails_get_the_same_response(): void
    {
        Notification::fake();
        $this->user();

        $known = $this->postJson('/api/user/forgot-password', ['email' => 'sara@example.com']);
        $unknown = $this->postJson('/api/user/forgot-password', ['email' => 'nobody@example.com']);

        $known->assertOk();
        $unknown->assertOk();
        $this->assertSame($known->json('message'), $unknown->json('message'));
    }

    public function test_the_email_link_points_at_the_storefront_reset_page(): void
    {
        Notification::fake();
        $user = $this->user();

        $this->postJson('/api/user/forgot-password', ['email' => $user->email])->assertOk();

        Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $mail) use ($user) {
            $url = $mail->toMail($user)->actionUrl;

            return str_contains($url, '/reset-password?token=' . urlencode($mail->token))
                && str_contains($url, 'email=' . urlencode($user->email));
        });
    }

    public function test_reset_changes_the_password_and_ends_existing_sessions(): void
    {
        Notification::fake();
        $user = $this->user();
        $user->createToken('user_token');
        DeviceToken::create(['user_id' => $user->id, 'token' => 'phone', 'platform' => 'android']);

        $this->postJson('/api/user/forgot-password', ['email' => $user->email]);

        $token = null;
        Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $mail) use (&$token) {
            $token = $mail->token;

            return true;
        });

        $this->postJson('/api/user/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])->assertOk();

        $this->assertSame(0, $user->tokens()->count());
        $this->assertSame(0, $user->deviceTokens()->count());
        $this->postJson('/api/user/login', ['email' => $user->email, 'password' => 'new-password'])->assertOk();
    }

    public function test_reset_with_a_bad_token_is_rejected(): void
    {
        $user = $this->user();

        $this->postJson('/api/user/reset-password', [
            'token' => 'wrong',
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])->assertStatus(422);

        $this->assertTrue(Hash::check('old-password', $user->fresh()->password));
    }
}
