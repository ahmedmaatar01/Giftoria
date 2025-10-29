<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Occasion;
use App\Models\OccasionImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class OccasionController extends Controller
{
    public function index()
    {
        return response()->json(Occasion::with('categories', 'images')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'arabic_name' => 'nullable|string',
            'slug' => 'nullable|string|unique:occasions,slug',
            'description' => 'nullable|string',
            'arabic_description' => 'nullable|string',
            'show_menu' => 'nullable|boolean',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $data['show_menu'] = true;

        if ($request->hasFile('featured_image')) {
            $featuredImage = $request->file('featured_image');
            $featuredImageName = time() . '_featured_' . Str::random(10) . '.' . $featuredImage->getClientOriginalExtension();
            $featuredImagePath = $featuredImage->storeAs('occasions', $featuredImageName, 'public');
            $data['featured_image'] = $featuredImagePath;
        }

        $categoryIds = $data['category_ids'] ?? [];
        unset($data['category_ids']);

        $occasion = Occasion::create($data);

        if (!empty($categoryIds)) {
            $occasion->categories()->sync($categoryIds);
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $imageName = time() . '_' . $index . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('occasions', $imageName, 'public');
                OccasionImage::create([
                    'occasion_id' => $occasion->id,
                    'image_path' => $imagePath,
                    'is_featured' => $index === 0,
                ]);
            }
        }

        return response()->json($occasion->load('categories', 'images'), 201);
    }

    public function show($id)
    {
        $occasion = Occasion::with('categories', 'images')->findOrFail($id);
        return response()->json($occasion);
    }

    public function update(Request $request, $id)
    {
        $occasion = Occasion::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string',
            'arabic_name' => 'nullable|string',
            'slug' => 'nullable|string|unique:occasions,slug,' . $id,
            'description' => 'nullable|string',
            'arabic_description' => 'nullable|string',
            'show_menu' => 'nullable|boolean',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $data['show_menu'] = true;


        if ($request->hasFile('featured_image')) {
            if ($occasion->featured_image) {
                Storage::disk('public')->delete($occasion->featured_image);
            }
            $featuredImage = $request->file('featured_image');
            $featuredImageName = time() . '_featured_' . Str::random(10) . '.' . $featuredImage->getClientOriginalExtension();
            $featuredImagePath = $featuredImage->storeAs('occasions', $featuredImageName, 'public');
            $data['featured_image'] = $featuredImagePath;
        }

        $categoryIds = $data['category_ids'] ?? null;
        unset($data['category_ids']);

        $occasion->update($data);

        if (is_array($categoryIds)) {
            $occasion->categories()->sync($categoryIds);
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $imageName = time() . '_' . $index . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('occasions', $imageName, 'public');
                OccasionImage::create([
                    'occasion_id' => $occasion->id,
                    'image_path' => $imagePath,
                    'is_featured' => false,
                ]);
            }
        }

        return response()->json($occasion->load('categories', 'images'));
    }

    public function destroy($id)
    {
        $occasion = Occasion::with('images')->findOrFail($id);
        if ($occasion->featured_image) {
            Storage::disk('public')->delete($occasion->featured_image);
        }
        foreach ($occasion->images as $image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }
        $occasion->categories()->detach();
        $occasion->delete();
        return response()->json(['message' => 'Occasion deleted']);
    }

    public function deleteImage($occasionId, $imageId)
    {
        $occasion = Occasion::findOrFail($occasionId);
        $image = OccasionImage::where('occasion_id', $occasionId)->findOrFail($imageId);
        Storage::disk('public')->delete($image->image_path);
        $image->delete();
        return response()->json(['message' => 'Image deleted successfully']);
    }

    public function setFeaturedImage($occasionId, $imageId)
    {
        OccasionImage::where('occasion_id', $occasionId)->update(['is_featured' => false]);
        $image = OccasionImage::where('occasion_id', $occasionId)->findOrFail($imageId);
        $image->update(['is_featured' => true]);
        return response()->json(['message' => 'Featured image updated successfully']);
    }
}
