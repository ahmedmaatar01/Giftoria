
<?php

use App\Http\Controllers\Api\CommandController;
// Command management

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserAuthController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductImageController;
use App\Http\Controllers\Api\CustomFieldController;
use App\Http\Controllers\Api\ProductCustomValueController;
use App\Http\Controllers\Api\OccasionController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('user')->group(function () {
    Route::post('register', [UserAuthController::class, 'register']);
    Route::post('login', [UserAuthController::class, 'login']);
    Route::middleware('auth:sanctum')->get('me', [UserAuthController::class, 'me']);
    Route::middleware('auth:sanctum')->post('logout', [UserAuthController::class, 'logout']);
});

Route::prefix('admin')->group(function () {
    Route::post('register', [AdminAuthController::class, 'register']);
    Route::post('login', [AdminAuthController::class, 'login']);
    Route::middleware('auth:admin')->get('me', [AdminAuthController::class, 'me']);
    Route::middleware('auth:admin')->post('logout', [AdminAuthController::class, 'logout']);
    Route::middleware('auth:admin')->get('dashboard', [AdminAuthController::class, 'dashboard']);
});

// CRUD routes for catalog
Route::apiResource('categories', CategoryController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('product-images', ProductImageController::class);
Route::apiResource('custom-fields', CustomFieldController::class);
Route::apiResource('product-custom-values', ProductCustomValueController::class);
Route::apiResource('commands', CommandController::class);
Route::apiResource('occasions', OccasionController::class);

// Route for uploading images to a product
Route::post('products/{product}/images', [ProductImageController::class, 'storeMultiple']);

// Routes for category image management
Route::delete('categories/{category}/images/{image}', [CategoryController::class, 'deleteImage']);
Route::patch('categories/{category}/images/{image}/featured', [CategoryController::class, 'setFeaturedImage']);

// Routes for occasion image management
Route::delete('occasions/{occasion}/images/{image}', [OccasionController::class, 'deleteImage']);
Route::patch('occasions/{occasion}/images/{image}/featured', [OccasionController::class, 'setFeaturedImage']);
//featured product
Route::get('/products/featured', [ProductController::class, 'featured']);
//get commandes by user 
Route::get('/users/{userId}/commands', [CommandController::class, 'getByUser']);

