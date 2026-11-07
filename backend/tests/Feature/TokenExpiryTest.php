<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class TokenExpiryTest extends TestCase
{
    use RefreshDatabase;

    private const CUSTOMER = ['email' => 'sara@example.com', 'password' => 'password'];

    protected function setUp(): void
    {
        parent::setUp();

        User::create(['name' => 'Sara', 'email' => self::CUSTOMER['email'], 'password' => Hash::make('password')]);
    }

    private function statusOf(string $url, string $token): int
    {
        $this->app['auth']->forgetGuards();

        return $this->getJson($url, ['Authorization' => 'Bearer ' . $token])->status();
    }

    public function test_a_mobile_login_lasts_30_days(): void
    {
        $token = $this->postJson('/api/user/login', self::CUSTOMER + ['client' => 'mobile'])->json('access_token');

        $this->travel(29)->days();
        $this->assertSame(200, $this->statusOf('/api/user/me', $token));

        $this->travel(2)->days();
        $this->assertSame(401, $this->statusOf('/api/user/me', $token));
    }

    public function test_a_mobile_registration_lasts_30_days(): void
    {
        $token = $this->postJson('/api/user/register', [
            'first_name' => 'New',
            'last_name' => 'User',
            'email' => 'new@example.com',
            'password' => 'password',
            'client' => 'mobile',
        ])->json('access_token');

        $this->travel(29)->days();
        $this->assertSame(200, $this->statusOf('/api/user/me', $token));
    }

    public function test_a_website_login_still_lasts_5_hours(): void
    {
        $token = $this->postJson('/api/user/login', self::CUSTOMER)->json('access_token');

        $this->travel(299)->minutes();
        $this->assertSame(200, $this->statusOf('/api/user/me', $token));

        $this->travel(2)->minutes();
        $this->assertSame(401, $this->statusOf('/api/user/me', $token));
    }

    public function test_an_admin_login_still_lasts_5_hours_even_when_asking_for_mobile(): void
    {
        Admin::create(['name' => 'Staff', 'email' => 'staff@giftoria.me', 'password' => Hash::make('password')]);
        $token = $this->postJson('/api/admin/login', [
            'email' => 'staff@giftoria.me',
            'password' => 'password',
            'client' => 'mobile',
        ])->json('access_token');

        $this->travel(299)->minutes();
        $this->assertSame(200, $this->statusOf('/api/admin/me', $token));

        $this->travel(2)->minutes();
        $this->assertSame(401, $this->statusOf('/api/admin/me', $token));
    }

    public function test_tokens_issued_before_this_change_keep_their_5_hours(): void
    {
        $user = User::first();
        $user->createToken('user_token');
        $migration = require database_path('migrations/2026_11_07_000003_set_expiry_on_existing_personal_access_tokens.php');

        $migration->up();

        $stored = $user->tokens()->first();
        $this->assertEquals($stored->created_at->addMinutes(300), $stored->expires_at);
    }
}
