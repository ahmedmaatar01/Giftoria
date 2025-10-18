<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Command;
use App\Models\CommandProduct;
use App\Models\Product;
use App\Models\User;
use App\Models\CustomField;
use App\Models\ProductCustomValue;

class CommandController extends Controller
{
    public function index()
    {
        // Return all commands with user and products (with pivot data)
        return Command::with(['user', 'products', 'commandProducts.product'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'customer_first_name' => 'nullable|string|max:255',
            'customer_last_name' => 'nullable|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'status' => 'nullable|string|max:50',
            'shipping_address' => 'nullable|string',
            'billing_address' => 'nullable|string',
            'payment_method' => 'nullable|in:cod,online',
            'source' => 'nullable|string|max:50',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.custom_fields' => 'nullable|array',
            'products.*.custom_fields.*.field_id' => 'required_with:products.*.custom_fields|integer',
            'products.*.custom_fields.*.value' => 'required_with:products.*.custom_fields|string',
        ]);

        // Calculate total with custom field pricing
        $total = 0;
        $linePayloads = [];
        foreach ($validated['products'] as $prod) {
            $product = Product::findOrFail($prod['product_id']);
            $basePrice = (float) $product->price;
            $unitPrice = $basePrice;

            // Map custom fields to {name, value}
            $customFields = [];
            if (!empty($prod['custom_fields']) && is_array($prod['custom_fields'])) {
                foreach ($prod['custom_fields'] as $cf) {
                    $field = CustomField::find($cf['field_id'] ?? null);
                    if ($field) {
                        $customFields[] = [
                            'name' => $field->name,
                            'value' => $cf['value'],
                        ];
                    }
                }
            }

            $quantity = (int) $prod['quantity'];
            $lineTotal = round($unitPrice * $quantity, 2);
            $total += $lineTotal;
            $linePayloads[] = [
                'product' => $product,
                'quantity' => $quantity,
                'price_at_order_time' => $basePrice,
                'unit_price' => round($unitPrice, 2),
                'line_total' => $lineTotal,
                'custom_fields' => $customFields,
            ];
        }

        $command = Command::create([
            'user_id' => $validated['user_id'] ?? null,
            'customer_first_name' => $validated['customer_first_name'] ?? null,
            'customer_last_name' => $validated['customer_last_name'] ?? null,
            'customer_email' => $validated['customer_email'] ?? null,
            'customer_phone' => $validated['customer_phone'] ?? null,
            'status' => $validated['status'] ?? 'pending',
            'shipping_address' => $validated['shipping_address'] ?? null,
            'billing_address' => $validated['billing_address'] ?? null,
            'payment_method' => $validated['payment_method'] ?? null,
            'source' => $validated['source'] ?? 'website',
            'description' => $validated['description'] ?? null,
            'total' => $total,
            'name' => ($validated['customer_first_name'] ?? '') . ' ' . ($validated['customer_last_name'] ?? ''),
            'placed_at' => now(),
        ]);

        // Attach products with custom selections and computed prices
        foreach ($linePayloads as $line) {
            $command->products()->attach($line['product']->id, [
                'quantity' => $line['quantity'],
                'price_at_order_time' => $line['price_at_order_time'],
                'custom_fields' => json_encode($line['custom_fields']),
                'unit_price' => $line['unit_price'],
                'line_total' => $line['line_total'],
            ]);
        }

        return response()->json($command->load(['user', 'products', 'commandProducts.product']), 201);
    }

    public function show($id)
    {
        // Return command with user and products (with pivot data)
        return Command::with(['user', 'products', 'commandProducts.product'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $command = Command::findOrFail($id);
        $validated = $request->validate([
            'status' => 'nullable|string|max:50',
            'shipping_address' => 'nullable|string',
            'billing_address' => 'nullable|string',
            'payment_method' => 'nullable|in:cod,online',
            'source' => 'nullable|string|max:50',
            'products' => 'nullable|array',
            'products.*.product_id' => 'required_with:products|exists:products,id',
            'products.*.quantity' => 'required_with:products|integer|min:1',
            'products.*.custom_fields' => 'nullable|array',
            'products.*.custom_fields.*.field_id' => 'required_with:products.*.custom_fields|integer',
            'products.*.custom_fields.*.value' => 'required_with:products.*.custom_fields|string',
        ]);

        $command->update([
            'status' => $validated['status'] ?? $command->status,
            'shipping_address' => $validated['shipping_address'] ?? $command->shipping_address,
            'billing_address' => $validated['billing_address'] ?? $command->billing_address,
            'payment_method' => $validated['payment_method'] ?? $command->payment_method,
            'source' => $validated['source'] ?? $command->source,
        ]);

        // If products are provided, sync them
        if (!empty($validated['products'])) {
            $syncData = [];
            $total = 0;
            foreach ($validated['products'] as $prod) {
                $product = Product::findOrFail($prod['product_id']);
                $basePrice = (float) $product->price;
                $unitPrice = $basePrice;
                // Ignore custom fields for now
                $selections = [];
                $quantity = (int) $prod['quantity'];
                $lineTotal = round($unitPrice * $quantity, 2);
                $total += $lineTotal;
                $syncData[$product->id] = [
                    'quantity' => $quantity,
                    'price_at_order_time' => $basePrice,
                    'custom_fields' => json_encode($selections),
                    'unit_price' => round($unitPrice, 2),
                    'line_total' => $lineTotal,
                ];
            }
            $command->products()->sync($syncData);
            $command->update(['total' => $total]);
        }

        return response()->json($command->load(['user', 'products', 'commandProducts.product']));
    }

    public function destroy($id)
    {
        $command = Command::findOrFail($id);
        $command->delete();
        return response()->json(null, 204);
    }
}
