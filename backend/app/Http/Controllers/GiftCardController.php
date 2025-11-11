<?php

namespace App\Http\Controllers;

use App\Models\GiftCard;
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
            $giftCards = GiftCard::all();
            
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
            'name' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
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
            $giftCardData = $request->only(['name', 'name_ar', 'is_active']);

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
            'name' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
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
            $giftCardData = $request->only(['name', 'name_ar', 'is_active']);

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
}