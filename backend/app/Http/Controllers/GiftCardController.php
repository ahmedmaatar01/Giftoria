<?php

namespace App\Http\Controllers;

use App\Models\GiftCard;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class GiftCardController extends Controller
{
    /**
     * Display a listing of the gift cards.
     */
    public function index(): JsonResponse
    {
        try {
            $giftCards = GiftCard::with('products')->get();
            
            return response()->json([
                'success' => true,
                'data' => $giftCards,
                'message' => 'Gift cards retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving gift cards: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created gift card.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'signing' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $giftCardData = $request->only(['title', 'description', 'signing', 'is_active']);
            
            // Handle image upload
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('gift_cards', 'public');
                $giftCardData['image'] = $imagePath;
            }

            $giftCard = GiftCard::create($giftCardData);

            return response()->json([
                'success' => true,
                'data' => $giftCard,
                'message' => 'Gift card created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating gift card: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified gift card.
     */
    public function show(GiftCard $giftCard): JsonResponse
    {
        try {
            $giftCard->load('products');
            
            return response()->json([
                'success' => true,
                'data' => $giftCard,
                'message' => 'Gift card retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving gift card: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified gift card.
     */
    public function update(Request $request, GiftCard $giftCard): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'signing' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $giftCardData = $request->only(['title', 'description', 'signing', 'is_active']);
            
            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($giftCard->image && Storage::disk('public')->exists($giftCard->image)) {
                    Storage::disk('public')->delete($giftCard->image);
                }
                
                $imagePath = $request->file('image')->store('gift_cards', 'public');
                $giftCardData['image'] = $imagePath;
            }

            $giftCard->update($giftCardData);

            return response()->json([
                'success' => true,
                'data' => $giftCard->fresh(),
                'message' => 'Gift card updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating gift card: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified gift card.
     */
    public function destroy(GiftCard $giftCard): JsonResponse
    {
        try {
            // Delete image if exists
            if ($giftCard->image && Storage::disk('public')->exists($giftCard->image)) {
                Storage::disk('public')->delete($giftCard->image);
            }

            $giftCard->delete();

            return response()->json([
                'success' => true,
                'message' => 'Gift card deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting gift card: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Attach a gift card to a product.
     */
    public function attachToProduct(Request $request, GiftCard $giftCard): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = Product::findOrFail($request->product_id);
            
            // Check if already attached
            if ($giftCard->products()->where('product_id', $product->id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gift card is already attached to this product'
                ], 400);
            }

            $giftCard->products()->attach($product->id);

            return response()->json([
                'success' => true,
                'message' => 'Gift card attached to product successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error attaching gift card to product: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Detach a gift card from a product.
     */
    public function detachFromProduct(Request $request, GiftCard $giftCard): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = Product::findOrFail($request->product_id);
            $giftCard->products()->detach($product->id);

            return response()->json([
                'success' => true,
                'message' => 'Gift card detached from product successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error detaching gift card from product: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get gift cards for a specific product.
     */
    public function getProductGiftCards(Product $product): JsonResponse
    {
        try {
            $giftCards = $product->giftCards()->active()->get();

            return response()->json([
                'success' => true,
                'data' => $giftCards,
                'message' => 'Product gift cards retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving product gift cards: ' . $e->getMessage()
            ], 500);
        }
    }
}