<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins',
            'password' => 'required|string|min:8',
        ]);

        $admin = Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => array_merge($admin->toArray(), [
                'role' => 'admin',
                'is_super' => $admin->is_super
            ])
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (! $admin) {
            return response()->json(['error' => 'Admin not found'], 404);
        }

        if (! Hash::check($request->password, $admin->password)) {
            return response()->json(['error' => 'Password incorrect'], 401);
        }

        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => array_merge($admin->toArray(), [
                'role' => 'admin',
                'is_super' => $admin->is_super
            ])
        ]);
    }

    public function me(Request $request)
    {
        $admin = $request->user();
        if ($admin) {
            return response()->json(array_merge($admin->toArray(), [
                'role' => 'admin',
                'is_super' => $admin->is_super
            ]));
        }
        return response()->json(null, 404);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user && method_exists($user, 'tokens')) {
            $user->tokens()->delete();
        }
        return response()->json(['message' => 'Logged out']);
    }

    public function dashboard(Request $request)
    {
        return response()->json(['message' => 'Welcome, Admin!', 'admin' => $request->user()]);
    }

    public function update(Request $request)
    {
        $admin = $request->user();
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:admins,email,' . $admin->id,
        ]);

        $admin->fill($validated);
        $admin->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => array_merge($admin->toArray(), [
                'role' => 'admin',
                'is_super' => $admin->is_super
            ])
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $admin = $request->user();

        if (! Hash::check($request->current_password, $admin->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 422);
        }

        $admin->password = Hash::make($request->new_password);
        $admin->save();

        return response()->json(['message' => 'Password changed successfully']);
    }
}
