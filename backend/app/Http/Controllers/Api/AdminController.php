<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    // List all admins (super admin only)
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->is_super != 7) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $admins = Admin::all();
        return response()->json($admins);
    }

    // Create a new admin (super admin only)
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->is_super != 7) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins',
            'password' => 'required|string|min:6',
            'is_super' => 'nullable|integer',
        ]);
        $data['password'] = Hash::make($data['password']);
        $admin = Admin::create($data);
        return response()->json($admin, 201);
    }

    // Delete an admin (super admin only)
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || $user->is_super != 7) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $admin = Admin::find($id);
        if (!$admin) {
            return response()->json(['message' => 'Admin not found'], 404);
        }
        $admin->delete();
        return response()->json(['message' => 'Admin deleted']);
    }
}
