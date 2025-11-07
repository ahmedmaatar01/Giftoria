<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        // Eager load category.customFields so the Product accessor for custom_fields
        // (which surfaces category custom fields) does not trigger N+1 queries.
        $products = Product::with(['category.customFields', 'images', 'customValues', 'giftCards'])->get();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string',
            'arabic_name' => 'nullable|string',
            'description' => 'nullable|string',
            'arabic_description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'featured_image' => 'nullable|string',
            'featured' => 'boolean',
            'lead_time' => 'nullable|string',
            'gift_card_ids' => 'nullable|array',
            'gift_card_ids.*' => 'exists:gift_cards,id',
        ]);

        // Create product
        $productData = collect($data)->except('gift_card_ids')->toArray();
        $product = Product::create($productData);

        // Attach gift cards if provided
        if (isset($data['gift_card_ids'])) {
            $product->giftCards()->sync($data['gift_card_ids']);
        }

        // Load relationships for response
        $product->load(['category.customFields', 'images', 'customValues', 'giftCards']);
        
        return response()->json($product, 201);
    }

    public function show($id)
    {
        // Include category.customFields for the appended custom_fields attribute
        $product = Product::with(['category.customFields', 'images', 'customValues', 'giftCards'])->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $data = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string',
            'arabic_name' => 'nullable|string',
            'description' => 'nullable|string',
            'arabic_description' => 'nullable|string',
            'price' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
            'featured_image' => 'nullable|string',
            'featured' => 'boolean',
            'lead_time' => 'nullable|string',
            'gift_card_ids' => 'nullable|array',
            'gift_card_ids.*' => 'exists:gift_cards,id',
        ]);

        // Update product data
        $productData = collect($data)->except('gift_card_ids')->toArray();
        $product->update($productData);

        // Update gift cards if provided
        if (array_key_exists('gift_card_ids', $data)) {
            $product->giftCards()->sync($data['gift_card_ids'] ?? []);
        }

        // Load relationships for response
        $product->load(['category.customFields', 'images', 'customValues', 'giftCards']);
        
        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
    public function featured()
    {
        $featuredProducts = Product::where('featured', 1)
            ->with(['category.customFields', 'images', 'customValues', 'giftCards'])
            ->get();

        return response()->json($featuredProducts);
    }
}
