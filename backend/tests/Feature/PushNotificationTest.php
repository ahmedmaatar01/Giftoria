<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Command;
use App\Models\DeviceToken;
use App\Models\OrderNote;
use App\Models\User;
use App\Services\FcmService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Mockery;
use Tests\TestCase;

class PushNotificationTest extends TestCase
{
    use RefreshDatabase;

    private User $customer;
    private Command $order;

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer = $this->makeUser('sara@example.com');
        $this->order = Command::create(['name' => 'Sara', 'user_id' => $this->customer->id, 'total' => 10, 'status' => 'pending']);
    }

    private function makeUser(string $email): User
    {
        return User::create(['name' => 'Sara', 'email' => $email, 'password' => Hash::make('password')]);
    }

    private function adminToken(): string
    {
        $admin = Admin::create(['name' => 'Staff', 'email' => 'staff@giftoria.me', 'password' => Hash::make('password')]);

        return $admin->createToken('admin_token')->plainTextToken;
    }

    private function bearer(string $token): array
    {
        return ['Authorization' => 'Bearer ' . $token];
    }

    /** Replace FCM and capture what would be sent. */
    private function fakeFcm(string $result = FcmService::SENT): \ArrayObject
    {
        $sent = new \ArrayObject();
        $fake = Mockery::mock(FcmService::class);
        $fake->shouldReceive('isConfigured')->andReturn(true);
        $fake->shouldReceive('send')->andReturnUsing(function ($token, $title, $body, $data) use ($sent, $result) {
            $sent[] = compact('token', 'title', 'body', 'data');

            return $result;
        });
        $this->app->instance(FcmService::class, $fake);

        return $sent;
    }

    private function registerDevice(string $token = 'phone', string $locale = 'en'): void
    {
        DeviceToken::create(['user_id' => $this->customer->id, 'token' => $token, 'platform' => 'android', 'locale' => $locale]);
    }

    public function test_status_change_through_the_api_sends_a_push_and_fills_the_inbox(): void
    {
        $sent = $this->fakeFcm();
        $this->registerDevice();

        $this->putJson("/api/commands/{$this->order->id}/status", ['status' => 'shipped'], $this->bearer($this->adminToken()))
            ->assertOk();

        $this->assertCount(1, $sent);
        $this->assertSame('phone', $sent[0]['token']);
        $this->assertSame('Your order has been shipped.', $sent[0]['body']);
        $this->assertSame('order_status_changed', $sent[0]['data']['type']);
        $this->assertSame($this->order->id, $sent[0]['data']['command_id']);
        $this->assertSame('shipped', $sent[0]['data']['status']);
        $this->assertSame(1, $this->customer->unreadNotifications()->count());
    }

    public function test_push_uses_the_locale_of_each_device(): void
    {
        $sent = $this->fakeFcm();
        $this->registerDevice('phone-en', 'en');
        $this->registerDevice('phone-ar', 'ar');

        $this->order->update(['status' => 'delivered']);

        $this->assertSame('Your order has been delivered.', $sent[0]['body']);
        $this->assertSame('تم توصيل طلبك.', $sent[1]['body']);
    }

    public function test_status_set_by_the_order_update_route_is_also_notified(): void
    {
        $sent = $this->fakeFcm();
        $this->registerDevice();

        $this->putJson("/api/commands/{$this->order->id}", ['status' => 'confirmed'], $this->bearer($this->adminToken()))
            ->assertOk();

        $this->assertCount(1, $sent);
    }

    public function test_saving_the_same_status_or_other_fields_sends_nothing(): void
    {
        $sent = $this->fakeFcm();
        $this->registerDevice();

        $this->order->update(['status' => 'pending', 'description' => 'changed']);

        $this->assertCount(0, $sent);
        $this->assertSame(0, $this->customer->notifications()->count());
    }

    public function test_a_sadad_payment_sends_one_push_even_when_callback_and_webhook_both_fire(): void
    {
        $sent = $this->fakeFcm();
        $this->registerDevice();
        $payload = ['ORDER_ID' => $this->order->id, 'transactionStatus' => 3, 'transactionNumber' => 'T1', 'txnAmount' => '10.00'];

        $this->post('/sadad/callback', $payload)->assertRedirect();
        $this->postJson('/api/sadad/webhook', $payload)->assertOk();

        $this->assertSame('paid', $this->order->fresh()->status);
        $this->assertCount(1, $sent);
        $this->assertSame('We have received your payment.', $sent[0]['body']);
    }

    public function test_unknown_status_falls_back_to_a_generic_message(): void
    {
        $sent = $this->fakeFcm();
        $this->registerDevice();

        $this->order->update(['status' => 'on_hold']);

        $this->assertSame('Your order status has been updated.', $sent[0]['body']);
    }

    public function test_guest_orders_are_skipped_without_error(): void
    {
        $sent = $this->fakeFcm();
        $guestOrder = Command::create(['name' => 'Sara', 'user_id' => null, 'total' => 10, 'status' => 'pending']);

        $guestOrder->update(['status' => 'shipped']);

        $this->assertCount(0, $sent);
    }

    public function test_admin_reply_notifies_the_customer(): void
    {
        $sent = $this->fakeFcm();
        $this->registerDevice();

        $this->postJson("/api/commands/{$this->order->id}/notes", [
            'content' => 'Your gift is ready',
            'note_type' => 'customer',
            'is_visible_to_customer' => true,
        ], $this->bearer($this->adminToken()))->assertCreated();

        $this->assertCount(1, $sent);
        $this->assertSame('Your gift is ready', $sent[0]['body']);
        $this->assertSame('order_note_added', $sent[0]['data']['type']);
    }

    public function test_internal_admin_notes_do_not_notify(): void
    {
        $sent = $this->fakeFcm();
        $this->registerDevice();

        $this->postJson("/api/commands/{$this->order->id}/notes", [
            'content' => 'Internal only',
            'note_type' => 'admin',
            'is_visible_to_customer' => false,
        ], $this->bearer($this->adminToken()))->assertCreated();

        // Marked visible by mistake, but still an internal note
        OrderNote::create([
            'command_id' => $this->order->id,
            'admin_id' => Admin::first()->id,
            'note_type' => 'admin',
            'content' => 'Internal too',
            'is_visible_to_customer' => true,
        ]);

        $this->assertCount(0, $sent);
    }

    public function test_customers_own_note_does_not_notify_them(): void
    {
        $sent = $this->fakeFcm();
        $this->registerDevice();
        $token = $this->customer->createToken('user_token')->plainTextToken;

        $this->postJson("/api/commands/{$this->order->id}/notes", ['content' => 'Any news?'], $this->bearer($token))
            ->assertCreated();

        $this->assertCount(0, $sent);
    }

    public function test_stale_tokens_are_removed(): void
    {
        $this->fakeFcm(FcmService::STALE_TOKEN);
        $this->registerDevice();

        $this->order->update(['status' => 'shipped']);

        $this->assertSame(0, DeviceToken::count());
    }

    public function test_a_failed_push_does_not_break_the_status_update(): void
    {
        $this->fakeFcm(FcmService::FAILED);
        $this->registerDevice();

        $this->putJson("/api/commands/{$this->order->id}/status", ['status' => 'shipped'], $this->bearer($this->adminToken()))
            ->assertOk();

        $this->assertSame('shipped', $this->order->fresh()->status);
        $this->assertSame(1, DeviceToken::count());
        $this->assertSame(1, $this->customer->notifications()->count());
    }

    public function test_without_firebase_credentials_the_inbox_still_works(): void
    {
        config(['services.fcm.credentials' => null]);
        $this->registerDevice();

        $this->order->update(['status' => 'shipped']);

        $this->assertSame(1, $this->customer->notifications()->count());
    }

    public function test_device_registration_moves_a_shared_phone_to_the_new_account(): void
    {
        $other = $this->makeUser('other@example.com');
        $payload = ['token' => 'phone', 'platform' => 'ios', 'locale' => 'ar'];

        $this->postJson('/api/user/device-tokens', $payload, $this->bearer($this->customer->createToken('t')->plainTextToken))
            ->assertOk();
        $this->app['auth']->forgetGuards();
        $this->postJson('/api/user/device-tokens', $payload, $this->bearer($other->createToken('t')->plainTextToken))
            ->assertOk();

        $this->assertSame(1, DeviceToken::count());
        $this->assertSame($other->id, DeviceToken::first()->user_id);
        $this->assertSame('ar', DeviceToken::first()->locale);
    }

    public function test_device_removal_only_touches_the_callers_devices(): void
    {
        $other = $this->makeUser('other@example.com');
        $this->registerDevice();

        $this->deleteJson('/api/user/device-tokens', ['token' => 'phone'], $this->bearer($other->createToken('t')->plainTextToken))
            ->assertOk();

        $this->assertSame(1, DeviceToken::count());
    }

    public function test_logout_removes_devices(): void
    {
        $this->registerDevice();
        $token = $this->customer->createToken('t')->plainTextToken;

        $this->postJson('/api/user/logout', [], $this->bearer($token))->assertOk();

        $this->assertSame(0, DeviceToken::count());
    }

    public function test_inbox_routes_reject_guests_and_admin_tokens(): void
    {
        $this->getJson('/api/user/notifications')->assertUnauthorized();
        $this->app['auth']->forgetGuards();
        $this->getJson('/api/user/notifications', $this->bearer($this->adminToken()))->assertUnauthorized();
    }

    public function test_inbox_lists_counts_and_marks_read(): void
    {
        $this->fakeFcm();
        $this->order->update(['status' => 'shipped']);
        $this->order->update(['status' => 'delivered']);
        $headers = $this->bearer($this->customer->createToken('t')->plainTextToken);

        $this->getJson('/api/user/notifications/unread-count', $headers)->assertOk()->assertJson(['count' => 2]);

        $list = $this->getJson('/api/user/notifications', $headers)->assertOk();
        $list->assertJsonCount(2, 'data');
        $list->assertJsonPath('data.0.type', 'order_status_changed');
        $list->assertJsonPath('data.0.command_id', $this->order->id);
        $this->assertArrayHasKey('ar', $list->json('data.0.title'));
        $this->assertNull($list->json('data.0.read_at'));

        $this->postJson('/api/user/notifications/' . $list->json('data.0.id') . '/read', [], $headers)->assertOk();
        $this->getJson('/api/user/notifications?unread=1', $headers)->assertJsonCount(1, 'data');

        $this->postJson('/api/user/notifications/read-all', [], $headers)->assertOk();
        $this->getJson('/api/user/notifications/unread-count', $headers)->assertJson(['count' => 0]);
    }

    public function test_a_user_cannot_read_someone_elses_notification(): void
    {
        $this->order->update(['status' => 'shipped']);
        $id = $this->customer->notifications()->first()->id;
        $other = $this->makeUser('other@example.com');

        $this->postJson("/api/user/notifications/{$id}/read", [], $this->bearer($other->createToken('t')->plainTextToken))
            ->assertNotFound();

        $this->assertNull($this->customer->notifications()->first()->read_at);
    }
}
