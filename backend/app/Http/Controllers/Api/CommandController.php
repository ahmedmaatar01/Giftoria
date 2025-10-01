<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Command;
use App\Models\CommandProduct;
use App\Models\Product;
use App\Models\User;

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
            'user_id' => 'required|exists:users,id',
            'status' => 'nullable|string|max:50',
            'shipping_address' => 'nullable|string',
            'billing_address' => 'nullable|string',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        // Calculate total
        $total = 0;
        foreach ($validated['products'] as $prod) {
            $product = Product::findOrFail($prod['product_id']);
            $total += $product->price * $prod['quantity'];
        }

        $command = Command::create([
            'user_id' => $validated['user_id'],
            'status' => $validated['status'] ?? 'pending',
            'shipping_address' => $validated['shipping_address'] ?? null,
            'billing_address' => $validated['billing_address'] ?? null,
            'total' => $total,
            'placed_at' => now(),
        ]);

        // Attach products
        foreach ($validated['products'] as $prod) {
            $product = Product::findOrFail($prod['product_id']);
            $command->products()->attach($product->id, [
                'quantity' => $prod['quantity'],
                'price_at_order_time' => $product->price,
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
            'products' => 'nullable|array',
            'products.*.product_id' => 'required_with:products|exists:products,id',
            'products.*.quantity' => 'required_with:products|integer|min:1',
        ]);

        $command->update([
            'status' => $validated['status'] ?? $command->status,
            'shipping_address' => $validated['shipping_address'] ?? $command->shipping_address,
            'billing_address' => $validated['billing_address'] ?? $command->billing_address,
        ]);

        // If products are provided, sync them
        if (!empty($validated['products'])) {
            $syncData = [];
            $total = 0;
            foreach ($validated['products'] as $prod) {
                $product = Product::findOrFail($prod['product_id']);
                $syncData[$product->id] = [
                    'quantity' => $prod['quantity'],
                    'price_at_order_time' => $product->price,
                ];
                $total += $product->price * $prod['quantity'];
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
