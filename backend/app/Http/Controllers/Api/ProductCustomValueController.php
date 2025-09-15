<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductCustomValue;

class ProductCustomValueController extends Controller
{
    public function index()
    {
        return response()->json(ProductCustomValue::with('product', 'customField')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'custom_field_id' => 'required|exists:custom_fields,id',
            'value' => 'required',
            'extra_price' => 'numeric',
        ]);
        $value = ProductCustomValue::create($data);
        return response()->json($value, 201);
    }

    public function show($id)
    {
        $value = ProductCustomValue::with('product', 'customField')->findOrFail($id);
        return response()->json($value);
    }

    public function update(Request $request, $id)
    {
        $value = ProductCustomValue::findOrFail($id);
        $data = $request->validate([
            'product_id' => 'sometimes|exists:products,id',
            'custom_field_id' => 'sometimes|exists:custom_fields,id',
            'value' => 'sometimes',
            'extra_price' => 'numeric',
        ]);
        $value->update($data);
        return response()->json($value);
    }

    public function destroy($id)
    {
        $value = ProductCustomValue::findOrFail($id);
        $value->delete();
        return response()->json(['message' => 'Product custom value deleted']);
    }
}
