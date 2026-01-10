

<?php
use App\Http\Controllers\Api\HomePageDetailController;

use App\Http\Controllers\Api\CommandController;
// Command management

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserAuthController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductImageController;
use App\Http\Controllers\Api\CustomFieldController;
use App\Http\Controllers\Api\ProductCustomValueController;
use App\Http\Controllers\Api\OccasionController;
use App\Http\Controllers\GiftCardController;
use App\Http\Controllers\ProductGiftCardSelectionController;
use App\Http\Controllers\SadadPaymentController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!

|
*/

// Public contact form submission
Route::post('/contact', [ContactController::class, 'store']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Health check endpoint for Docker
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now(), 'version' => '1.1']);
});

// Debug endpoint to test routing
Route::get('/test', function () {
    return response()->json(['message' => 'API routing works', 'timestamp' => now()]);
});
// Home Page Detail API (RESTful)
Route::apiResource('home-page-details', HomePageDetailController::class);

// Debug categories without controller
Route::get('/categories-test', function () {
    try {
        $count = \App\Models\Category::count();
        return response()->json(['message' => 'Categories table accessible', 'count' => $count]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Cache management route for debugging
Route::get('/clear-cache', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('route:clear');
        \Illuminate\Support\Facades\Artisan::call('config:clear');
        \Illuminate\Support\Facades\Artisan::call('cache:clear');
        return response()->json([
            'message' => 'Cache cleared successfully',
            'timestamp' => now()
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});
// Admin notifications
Route::middleware('auth:admin')->prefix('admin')->group(function () {
    Route::get('notifications/unseen', [\App\Http\Controllers\Api\NotificationController::class, 'unseen']);
    Route::post('notifications/commands/{id}/seen', [\App\Http\Controllers\Api\NotificationController::class, 'markCommandSeen']);
    Route::post('notifications/order-notes/{id}/seen', [\App\Http\Controllers\Api\NotificationController::class, 'markNoteSeen']);
});
Route::prefix('user')->group(function () {
    Route::post('register', [UserAuthController::class, 'register']);
    Route::post('login', [UserAuthController::class, 'login']);
    Route::middleware('auth:sanctum')->get('me', [UserAuthController::class, 'me']);
    Route::middleware('auth:sanctum')->put('update', [UserAuthController::class, 'update']);
    Route::middleware('auth:sanctum')->post('logout', [UserAuthController::class, 'logout']);
});

Route::prefix('admin')->group(function () {
    Route::post('register', [AdminAuthController::class, 'register']);
    Route::post('login', [AdminAuthController::class, 'login']);
    Route::middleware('auth:admin')->get('me', [AdminAuthController::class, 'me']);
    Route::middleware('auth:admin')->post('logout', [AdminAuthController::class, 'logout']);
    Route::middleware('auth:admin')->get('dashboard', [AdminAuthController::class, 'dashboard']);
    Route::middleware('auth:admin')->put('update', [AdminAuthController::class, 'update']);
    Route::middleware('auth:admin')->post('change-password', [AdminAuthController::class, 'changePassword']);

    // Super admin management routes
    Route::middleware('auth:admin')->get('admins', [\App\Http\Controllers\Api\AdminController::class, 'index']);
    Route::middleware('auth:admin')->post('admins', [\App\Http\Controllers\Api\AdminController::class, 'store']);
    Route::middleware('auth:admin')->delete('admins/{id}', [\App\Http\Controllers\Api\AdminController::class, 'destroy']);
});

// Featured products must be defined BEFORE the products resource to avoid
// route-model binding capturing 'featured' as a {product} parameter.
Route::get('/products/featured', [ProductController::class, 'featured']);

// CRUD routes for catalog - protect commands with auth
Route::apiResource('categories', CategoryController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('product-images', ProductImageController::class);
Route::apiResource('custom-fields', CustomFieldController::class);
Route::apiResource('product-custom-values', ProductCustomValueController::class);
// Public route for creating a command (guest checkout allowed)
Route::post('/commands', [CommandController::class, 'store']);

// Protected routes for admins or logged-in users
Route::apiResource('commands', CommandController::class)
    ->except(['store'])
    ->middleware('auth:sanctum');
Route::apiResource('occasions', OccasionController::class);
Route::apiResource('gift-cards', GiftCardController::class);

// Route for uploading images to a product
Route::post('products/{product}/images', [ProductImageController::class, 'storeMultiple']);

// Routes for category image management
Route::delete('categories/{category}/images/{image}', [CategoryController::class, 'deleteImage']);
Route::patch('categories/{category}/images/{image}/featured', [CategoryController::class, 'setFeaturedImage']);

// Routes for occasion image management
Route::delete('occasions/{occasion}/images/{image}', [OccasionController::class, 'deleteImage']);
Route::patch('occasions/{occasion}/images/{image}/featured', [OccasionController::class, 'setFeaturedImage']);
// (moved) featured product route now defined above products resource
//get commandes by user
Route::get('/users/{userId}/commands', [CommandController::class, 'getCommandsByUser'])->middleware('auth:sanctum');

// Order notes and status history routes
Route::get('/commands/{commandId}/notes', [CommandController::class, 'getNotes'])->middleware('auth:sanctum');
Route::post('/commands/{commandId}/notes', [CommandController::class, 'addNote'])->middleware('auth:sanctum');
Route::get('/commands/{commandId}/status-history', [CommandController::class, 'getStatusHistory'])->middleware('auth:sanctum');
Route::put('/commands/{commandId}/status', [CommandController::class, 'updateStatus'])->middleware('auth:sanctum');
Route::get('/commands/{commandId}/details', [CommandController::class, 'getCommandDetails'])->middleware('auth:sanctum');

// Gift card selection routes (for end users)
Route::get('/gift-cards/available', [ProductGiftCardSelectionController::class, 'getAvailableGiftCards']);
Route::post('/products/gift-card-selections', [ProductGiftCardSelectionController::class, 'createSelection']);
Route::get('/products/{product}/gift-card-selections', [ProductGiftCardSelectionController::class, 'getProductSelections']);
Route::put('/gift-card-selections/{selection}', [ProductGiftCardSelectionController::class, 'updateSelection']);
Route::delete('/gift-card-selections/{selection}', [ProductGiftCardSelectionController::class, 'deleteSelection']);

Route::post('/payments/sadad/init', [SadadPaymentController::class, 'init']);
Route::post('/sadad/webhook', [SadadPaymentController::class, 'webhook']);
use App\Models\Command;

Route::get('/public/order-status/{command}', function (Command $command) {
    return response()->json([
        'status' => $command->status,
    ]);
});

use App\Models\Payment;

Route::get('/public/order-payment-status/{command}', function (Command $command) {

    // Get the latest payment for this order
    $payment = Payment::where('command_id', $command->id)
        ->latest('created_at')
        ->first();

    if (!$payment) {
        return response()->json([
            'status' => 'pending', // No payment yet
        ]);
    }

    // Map SADAD transaction_status to friendly status
    switch ((int) $payment->transaction_status) {
        case 3:
            $status = 'paid';
            break;
        case 1:
        case 2:
            $status = 'pending';
            break;
        default:
            $status = 'failed';
            break;
    }

    return response()->json([
        'status' => $status,
    ]);
});
