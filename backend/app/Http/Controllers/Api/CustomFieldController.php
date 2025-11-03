<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CustomField;

class CustomFieldController extends Controller
{
    private function normalizeOptions($options)
    {
        return array_map(function ($opt) {
            // If backend receives only English string
            if (is_string($opt)) {
                return [
                    'en' => $opt,
                    'ar' => ''
                ];
            }

            // If frontend sends {en:"Small", ar:"صغير"}
            return [
                'en' => $opt['en'] ?? '',
                'ar' => $opt['ar'] ?? ''
            ];
        }, $options);
    }

    public function index()
    {
        return response()->json(CustomField::with('category')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string',
            'name_ar' => 'nullable|string',
            'type' => 'required|in:text,number,select,checkbox,file',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'affects_price' => 'boolean',
            'price_type' => 'nullable|in:fixed,percentage',
            'price_value' => 'nullable|numeric',
        ]);

        if (!empty($data['options'])) {
            $data['options'] = $this->normalizeOptions($data['options']);
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
            'name_ar' => 'sometimes|string',
            'type' => 'sometimes|in:text,number,select,checkbox,file',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'affects_price' => 'boolean',
            'price_type' => 'nullable|in:fixed,percentage',
            'price_value' => 'nullable|numeric',
        ]);

        if (isset($data['options'])) {
            $data['options'] = $this->normalizeOptions($data['options']);
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
