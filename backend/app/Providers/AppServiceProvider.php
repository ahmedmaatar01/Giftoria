<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $frontendUrl = env(
            'FRONTEND_URL',
            app()->environment('local') ? 'http://localhost:3000' : 'https://giftoria.me'
        );

        ResetPassword::createUrlUsing(function (object $user, string $token) use ($frontendUrl) {
            return rtrim($frontendUrl, '/')
                . '/reset-password?token=' . urlencode($token)
                . '&email=' . urlencode($user->getEmailForPasswordReset());
        });
    }
}
