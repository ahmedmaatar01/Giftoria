<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserAuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'country' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        // Combine first_name and last_name into name field
    $fullName = trim($request->first_name);

        $user = User::create([
            'name' => $fullName,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'country' => $request->country,
            'address' => $request->address,
        ]);

        $token = $user->createToken('user_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('user_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users,email,' . $user->id,
            'current_password' => 'nullable|string',
            'password' => 'nullable|string|min:8|confirmed',
            'country' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        // If changing password, verify current password
        if ($request->filled('password')) {
            if (!$request->filled('current_password')) {
                return response()->json([
                    'message' => 'Current password is required to set a new password'
                ], 422);
            }

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect'
                ], 422);
            }

            $user->password = Hash::make($request->password);
        }

        // Update other fields
        if ($request->filled('name')) {
            $user->name = $validated['name'];
        }

        if ($request->filled('last_name')) {
            $user->last_name = $validated['last_name'];
        }

        if ($request->filled('email')) {
            $user->email = $validated['email'];
        }


        if ($request->filled('country')) {
            $user->country = $validated['country'];
        }
        if ($request->filled('address')) {
            $user->address = $validated['address'];
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
