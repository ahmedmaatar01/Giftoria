<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HomePageDetail;

class HomePageDetailController extends Controller
{
    // Get the latest home page details
    public function show()
    {
        $detail = HomePageDetail::latest()->first();
        return response()->json($detail);
    }
    public function index()
    {
        $detail = HomePageDetail::latest()->first();
        return response()->json($detail);
    }
    // Store or update home page details

    public function store(Request $request)
    {   
        var_dump($request->all());
        $validated = $request->validate([
            'hero_type' => 'required|in:image,video',
            'hero_title_en' => 'required|string',
            'hero_title_ar' => 'required|string',
            'hero_media' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,webm,ogg|max:20480', // 20MB max
        ]);

        if ($request->hasFile('hero_media')) {
            $file = $request->file('hero_media');
            $filename = time() . '_hero_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('home', $filename, 'public');
            $validated['hero_media'] = $path;
        } else {
            $validated['hero_media'] = null;
        }

        $detail = HomePageDetail::create($validated);
        return response()->json($detail, 201);
    }

    // Optionally, update the latest record
    public function update(Request $request)
    {
        $validated = $request->validate([
            'hero_type' => 'required|in:image,video',
            'hero_title_en' => 'required|string',
            'hero_title_ar' => 'required|string',
            'hero_media' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,webm,ogg|max:20480',
        ]);
        $detail = HomePageDetail::latest()->first();
        if (!$detail) {
            return response()->json(['message' => 'No home page detail found'], 404);
        }

        if ($request->hasFile('hero_media')) {
            $file = $request->file('hero_media');
            $filename = time() . '_hero_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('home', $filename, 'public');
            $validated['hero_media'] = $path;
        } else {
            // Keep the old media if not uploading a new one
            $validated['hero_media'] = $detail->hero_media;
        }

        $detail->update($validated);
        return response()->json($detail);
    }
}
