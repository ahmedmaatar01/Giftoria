<?php

namespace App\Http\Controllers;

use App\Models\ProductGiftCardSelection;
use App\Models\GiftCard;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ProductGiftCardSelectionController extends Controller
{
    /**
     * Get all available gift card templates.
     */
    public function getAvailableGiftCards(): JsonResponse
    {
        try {
            $giftCards = GiftCard::where('is_active', true)->get();
            
            return response()->json([
                'success' => true,
                'data' => $giftCards,
                'message' => 'Available gift cards retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving gift cards: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new gift card selection for a product.
     */
    public function createSelection(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'gift_card_id' => 'required|exists:gift_cards,id',
            'custom_description' => 'nullable|string|max:1000',
            'custom_signing' => 'nullable|string|max:500',
            'customer_email' => 'nullable|email',
            'session_id' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Verify product has gift card option enabled
            $product = Product::findOrFail($request->product_id);
            if (!$product->has_gift_card) {
                return response()->json([
                    'success' => false,
                    'message' => 'This product does not support gift cards'
                ], 400);
            }

            $selection = ProductGiftCardSelection::create($request->all());
            $selection->load(['giftCard', 'product']);

            return response()->json([
                'success' => true,
                'data' => $selection,
                'message' => 'Gift card selection created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating gift card selection: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get gift card selections for a specific product.
     */
    public function getProductSelections(Product $product): JsonResponse
    {
        try {
            if (!$product->has_gift_card) {
                return response()->json([
                    'success' => false,
                    'message' => 'This product does not support gift cards'
                ], 400);
            }

            $selections = $product->giftCardSelections()
                ->with('giftCard')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $selections,
                'message' => 'Product gift card selections retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving selections: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a gift card selection.
     */
    public function updateSelection(Request $request, ProductGiftCardSelection $selection): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'gift_card_id' => 'sometimes|exists:gift_cards,id',
            'custom_description' => 'nullable|string|max:1000',
            'custom_signing' => 'nullable|string|max:500',
            'customer_email' => 'nullable|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $selection->update($request->all());
            $selection->load(['giftCard', 'product']);

            return response()->json([
                'success' => true,
                'data' => $selection,
                'message' => 'Gift card selection updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating selection: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a gift card selection.
     */
    public function deleteSelection(ProductGiftCardSelection $selection): JsonResponse
    {
        try {
            $selection->delete();

            return response()->json([
                'success' => true,
                'message' => 'Gift card selection deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting selection: ' . $e->getMessage()
            ], 500);
        }
    }
}