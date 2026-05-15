<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TagController extends Controller
{
    /**
     * Display a listing of the tags.
     */
    public function index(): JsonResponse
    {
        try {
            $tags = Tag::all();

            return response()->json([
                'success' => true,
                'data' => $tags,
                'message' => 'Tags retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving tags: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created tag.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'name_ar'     => 'nullable|string|max:255',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active'   => 'boolean',
            'occasion_id' => 'nullable|exists:occasions,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $tagData = $request->only(['name', 'name_ar', 'is_active', 'occasion_id']);

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('tags', 'public');
                $tagData['image'] = $imagePath;
            }

            $tag = Tag::create($tagData);

            return response()->json([
                'success' => true,
                'data'    => $tag->load('occasion'),
                'message' => 'Tag created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating tag: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified tag.
     */
    public function show(Tag $tag): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data'    => $tag,
                'message' => 'Tag retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving tag: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified tag.
     */
    public function update(Request $request, Tag $tag): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'name_ar'     => 'nullable|string|max:255',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active'   => 'boolean',
            'occasion_id' => 'nullable|exists:occasions,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $tagData = $request->only(['name', 'name_ar', 'is_active', 'occasion_id']);

            if ($request->hasFile('image')) {
                if ($tag->image && Storage::disk('public')->exists($tag->image)) {
                    Storage::disk('public')->delete($tag->image);
                }
                $imagePath = $request->file('image')->store('tags', 'public');
                $tagData['image'] = $imagePath;
            }

            $tag->update($tagData);

            return response()->json([
                'success' => true,
                'data'    => $tag->fresh(),
                'message' => 'Tag updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating tag: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified tag.
     */
    public function destroy(Tag $tag): JsonResponse
    {
        try {
            if ($tag->image && Storage::disk('public')->exists($tag->image)) {
                Storage::disk('public')->delete($tag->image);
            }

            $tag->delete();

            return response()->json([
                'success' => true,
                'message' => 'Tag deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting tag: ' . $e->getMessage()
            ], 500);
        }
    }
}
