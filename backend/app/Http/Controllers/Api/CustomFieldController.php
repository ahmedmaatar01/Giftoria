<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CustomField;

class CustomFieldController extends Controller
{
    public function index()
    {
        return response()->json(CustomField::with('category')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string',
            'type' => 'required|in:text,number,select,checkbox,file',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'affects_price' => 'boolean',
            'price_type' => 'nullable|in:fixed,percentage',
            'price_value' => 'nullable|numeric',
        ]);
        if (isset($data['options'])) {
            $data['options'] = json_encode($data['options']);
        }
        $field = CustomField::create($data);
        return response()->json($field, 201);
    }

    public function show($id)
    {
        $field = CustomField::with('category')->findOrFail($id);
        return response()->json($field);
    }

    public function update(Request $request, $id)
    {
        $field = CustomField::findOrFail($id);
        $data = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string',
            'type' => 'sometimes|in:text,number,select,checkbox,file',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'affects_price' => 'boolean',
            'price_type' => 'nullable|in:fixed,percentage',
            'price_value' => 'nullable|numeric',
        ]);
        if (isset($data['options'])) {
            $data['options'] = json_encode($data['options']);
        }
        $field->update($data);
        return response()->json($field);
    }

    public function destroy($id)
    {
        $field = CustomField::findOrFail($id);
        $field->delete();
        return response()->json(['message' => 'Custom field deleted']);
    }
}
