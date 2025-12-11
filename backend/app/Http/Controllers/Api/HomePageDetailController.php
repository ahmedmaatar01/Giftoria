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

    // Store or update home page details
    public function store(Request $request)
    {
        $validated = $request->validate([
            'hero_type' => 'required|in:image,video',
            'hero_media' => 'required|string',
            'hero_title_en' => 'required|string',
            'hero_title_ar' => 'required|string',
        ]);

        // For simplicity, always create a new record (or you can update the latest one)
        $detail = HomePageDetail::create($validated);
        return response()->json($detail, 201);
    }

    // Optionally, update the latest record
    public function update(Request $request)
    {
        $validated = $request->validate([
            'hero_type' => 'required|in:image,video',
            'hero_media' => 'required|string',
            'hero_title_en' => 'required|string',
            'hero_title_ar' => 'required|string',
        ]);
        $detail = HomePageDetail::latest()->first();
        if (!$detail) {
            return response()->json(['message' => 'No home page detail found'], 404);
        }
        $detail->update($validated);
        return response()->json($detail);
    }
}
