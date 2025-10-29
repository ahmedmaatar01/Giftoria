<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\CategoryImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::with('parent', 'children', 'images','customFields')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'slug' => 'nullable|string|unique:categories,slug',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'show_menu' => 'nullable|boolean',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Ensure show_menu defaults to false if not provided
        $data['show_menu'] = $data['show_menu'] ?? false;

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            $featuredImage = $request->file('featured_image');
            $featuredImageName = time() . '_featured_' . Str::random(10) . '.' . $featuredImage->getClientOriginalExtension();
            $featuredImagePath = $featuredImage->storeAs('categories', $featuredImageName, 'public');
            $data['featured_image'] = $featuredImagePath;
        }

        $category = Category::create($data);

        // Handle additional images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $imageName = time() . '_' . $index . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('categories', $imageName, 'public');

                CategoryImage::create([
                    'category_id' => $category->id,
                    'image_path' => $imagePath,
                    'is_featured' => $index === 0, // First image is featured
                ]);
            }
        }

        return response()->json($category->load('images'), 201);
    }

    public function show($id)
    {
        $category = Category::with('parent', 'children', 'products', 'customFields', 'images')->findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string',
            'name_ar' => 'nullable|string',
            'slug' => 'nullable|string|unique:categories,slug,' . $id,
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'show_menu' => 'nullable|boolean',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Ensure show_menu defaults to false if not provided
        if (array_key_exists('show_menu', $data)) {
            $data['show_menu'] = $data['show_menu'] ?? false;
        }

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            // Delete old featured image if exists
            if ($category->featured_image) {
                Storage::disk('public')->delete($category->featured_image);
            }

            $featuredImage = $request->file('featured_image');
            $featuredImageName = time() . '_featured_' . Str::random(10) . '.' . $featuredImage->getClientOriginalExtension();
            $featuredImagePath = $featuredImage->storeAs('categories', $featuredImageName, 'public');
            $data['featured_image'] = $featuredImagePath;
        }

        $category->update($data);

        // Handle additional images if provided
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $imageName = time() . '_' . $index . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('categories', $imageName, 'public');

                CategoryImage::create([
                    'category_id' => $category->id,
                    'image_path' => $imagePath,
                    'is_featured' => false, // Additional images are not featured by default
                ]);
            }
        }

        return response()->json($category->load('images'));
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        // Delete featured image if exists
        if ($category->featured_image) {
            Storage::disk('public')->delete($category->featured_image);
        }

        // Delete all associated images
        foreach ($category->images as $image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }

        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }

    /**
     * Delete a specific category image
     */
    public function deleteImage($categoryId, $imageId)
    {
        $category = Category::findOrFail($categoryId);
        $image = CategoryImage::where('category_id', $categoryId)->findOrFail($imageId);

        // Delete the file from storage
        Storage::disk('public')->delete($image->image_path);

        // Delete the database record
        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }

    /**
     * Set an image as featured
     */
    public function setFeaturedImage($categoryId, $imageId)
    {
        $category = Category::findOrFail($categoryId);

        // Remove featured status from all images
        CategoryImage::where('category_id', $categoryId)->update(['is_featured' => false]);

        // Set the selected image as featured
        $image = CategoryImage::where('category_id', $categoryId)->findOrFail($imageId);
        $image->update(['is_featured' => true]);

        return response()->json(['message' => 'Featured image updated successfully']);
    }
}
