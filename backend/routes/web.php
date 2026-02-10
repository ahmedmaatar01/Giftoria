<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SadadPaymentController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Debug route to test if web routes work
Route::get('/debug-web', function () {
    return response()->json(['message' => 'Web routing works', 'timestamp' => now()]);
});

// Debug API route in web.php to test
Route::get('/debug-api', function () {
    return response()->json(['message' => 'API in web routing works', 'timestamp' => now()]);
});
Route::post('/sadad/callback', [SadadPaymentController::class, 'callback'])
    ->name('sadad.callback');

Route::get('/sadad/redirect', [SadadPaymentController::class, 'redirect'])
    ->name('sadad.redirect');

Route::get('/sadad/pay', [SadadPaymentController::class, 'pay']);
Route::post('/sadad/checksum', [SadadPaymentController::class, 'checksum']);
Route::post('/sadad/payment-success', [SadadPaymentController::class, 'paymentSuccess']);
