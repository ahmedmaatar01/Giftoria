<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Command;

class CommandController extends Controller
{
    public function index()
    {
        return Command::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|max:50',
        ]);
        $command = Command::create($validated);
        return response()->json($command, 201);
    }

    public function show($id)
    {
        return Command::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $command = Command::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|max:50',
        ]);
        $command->update($validated);
        return response()->json($command);
    }

    public function destroy($id)
    {
        $command = Command::findOrFail($id);
        $command->delete();
        return response()->json(null, 204);
    }
}
