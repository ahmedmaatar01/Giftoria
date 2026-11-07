<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeviceToken;
use Illuminate\Http\Request;

class DeviceTokenController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string|max:512',
            'platform' => 'required|in:android,ios,web',
            'locale' => 'nullable|in:en,ar',
        ]);

        // Keyed on token alone: a shared phone must stop notifying the previous account
        DeviceToken::updateOrCreate(
            ['token' => $validated['token']],
            [
                'user_id' => $request->user()->id,
                'platform' => $validated['platform'],
                'locale' => $validated['locale'] ?? 'en',
            ]
        );

        return response()->json(['message' => 'Device registered']);
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string|max:512',
        ]);

        $request->user()->deviceTokens()->where('token', $validated['token'])->delete();

        return response()->json(['message' => 'Device removed']);
    }
}
