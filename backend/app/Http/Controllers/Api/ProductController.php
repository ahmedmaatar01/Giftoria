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
        $products = Product::with(['category.customFields', 'images', 'customValues'])->get();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string',
            'arabic_name' => 'nullable|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'featured_image' => 'nullable|string',
            'featured' => 'boolean',
            'lead_time' => 'nullable|string',
        ]);
        $product = Product::create($data);
        return response()->json($product, 201);
    }

    public function show($id)
    {
        // Include category.customFields for the appended custom_fields attribute
        $product = Product::with(['category.customFields', 'images', 'customValues'])->findOrFail($id);
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
            'price' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
            'featured_image' => 'nullable|string',
            'featured' => 'boolean',
            'lead_time' => 'nullable|string',
        ]);
        $product->update($data);
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
            ->with(['category.customFields', 'images', 'customValues'])
            ->get();

        return response()->json($featuredProducts);
    }
}
