<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductImage;

class ProductImageController extends Controller
{
    public function index()
    {
        return response()->json(ProductImage::with('product')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'image_path' => 'required|string',
            'is_featured' => 'boolean',
        ]);
        $image = ProductImage::create($data);
        return response()->json($image, 201);
    }

    public function storeMultiple(Request $request, $productId)
    {
        $request->validate([
            'images' => 'required',
            'images.*' => 'file|image|max:5120', // 5MB max per image
            'is_featured' => 'required|array',
        ]);
        $paths = [];
        foreach ($request->file('images') as $idx => $file) {
            $path = $file->store('products', 'public');
            $image = ProductImage::create([
                'product_id' => $productId,
                'image_path' => '/storage/' . $path,
                'is_featured' => isset($request->is_featured[$idx]) ? filter_var($request->is_featured[$idx], FILTER_VALIDATE_BOOLEAN) : false,
            ]);
            $paths[] = $image;
        }
        return response()->json($paths, 201);
    }

    public function show($id)
    {
        $image = ProductImage::with('product')->findOrFail($id);
        return response()->json($image);
    }

    public function update(Request $request, $id)
    {
        $image = ProductImage::findOrFail($id);
        $data = $request->validate([
            'product_id' => 'sometimes|exists:products,id',
            'image_path' => 'sometimes|string',
            'is_featured' => 'boolean',
        ]);
        $image->update($data);
        return response()->json($image);
    }

    public function destroy($id)
    {
        $image = ProductImage::findOrFail($id);
        $image->delete();
        return response()->json(['message' => 'Product image deleted']);
    }
}
