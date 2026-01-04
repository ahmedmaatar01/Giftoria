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
use App\Models\OrderNote;
use App\Models\OrderStatusHistory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\CommandReceivedMail;
use App\Mail\AdminCommandNotificationMail;

class CommandController extends Controller
{
    public function index()
    {
        // Return all commands with user, products, notes, status history, and gift card template
        return Command::with([
            'user',
            'products',
            'commandProducts.product',
            'notes.user',
            'notes.admin',
            'statusHistory.changedBy',
            'giftCardTemplate'
        ])->get();
    }

    /**
     * Process signature: save base64 image to storage or return text as-is
     * Returns array with ['signature' => path/text, 'type' => 'image'/'text']
     */
    private function processSignature($signature)
    {
        if (empty($signature)) {
            return ['signature' => null, 'type' => null];
        }

        // Check if it's a base64 image (drawn signature)
        if (Str::startsWith($signature, 'data:image')) {
            try {
                // Extract the base64 data
                $image = $signature;

                // Get the image type and data
                preg_match('/data:image\/(\w+);base64,/', $image, $type);
                $imageType = $type[1] ?? 'png';

                // Remove the data URL part
                $image = substr($image, strpos($image, ',') + 1);
                $image = base64_decode($image);

                // Generate unique filename
                $fileName = 'signature_' . uniqid() . '_' . time() . '.' . $imageType;

                // Save to storage/app/public/signatures
                Storage::disk('public')->put('signatures/' . $fileName, $image);

                // Return the path (relative to storage/app/public)
                return [
                    'signature' => 'signatures/' . $fileName,
                    'type' => 'image'
                ];
            } catch (\Exception $e) {
                Log::error('Failed to save signature image: ' . $e->getMessage());
                return ['signature' => null, 'type' => null];
            }
        }

        // It's a text signature, return as-is
        return [
            'signature' => $signature,
            'type' => 'text'
        ];
    }

    public function store(Request $request)
    {
        // Manually resolve user from Sanctum token if present (for guest+auth support)
        if (!$request->user() && $request->bearerToken()) {
            $accessToken = $request->bearerToken();
            $tokenModel = PersonalAccessToken::findToken($accessToken);
            if ($tokenModel && $tokenModel->tokenable) {
                Auth::setUser($tokenModel->tokenable);
                $request->setUserResolver(function () use ($tokenModel) {
                    return $tokenModel->tokenable;
                });
            }
        }
        $validated = $request->validate([
            'customer_first_name' => 'nullable|string|max:255',
            'customer_last_name' => 'nullable|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'status' => 'nullable|string|max:50',
            'shipping_address' => 'nullable|string',
            'billing_address' => 'nullable|string',
            'payment_method' => 'nullable|in:cod,online',
            'source' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'desired_delivery_at' => 'nullable|date',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.custom_fields' => 'nullable|array',
            'products.*.custom_fields.*.field_id' => 'nullable|integer',
            'products.*.custom_fields.*.value' => 'nullable|string',
            // Gift card validation
            'gift_card' => 'nullable|array',
            'gift_card.template_id' => 'nullable|exists:gift_cards,id',
            'gift_card.custom_description' => 'nullable|string',
            'gift_card.custom_signing' => 'nullable|string',
            'gift_card.product_ids' => 'nullable|array',
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

        // Process signature (save image if base64, or keep text)
        $signatureData = ['signature' => null, 'type' => null];

        // Debug logging
        Log::info('Gift Card Data Received:', [
            'has_gift_card' => isset($validated['gift_card']),
            'gift_card_data' => $validated['gift_card'] ?? null,
            'custom_signing' => $validated['gift_card']['custom_signing'] ?? 'NOT SET'
        ]);

        if (isset($validated['gift_card']['custom_signing']) && !empty($validated['gift_card']['custom_signing'])) {
            Log::info('Processing signature...', [
                'signature_length' => strlen($validated['gift_card']['custom_signing']),
                'starts_with_data_image' => Str::startsWith($validated['gift_card']['custom_signing'], 'data:image')
            ]);
            $signatureData = $this->processSignature($validated['gift_card']['custom_signing']);
            Log::info('Signature processed:', $signatureData);
        } else {
            Log::warning('No signature to process');
        }
        $userId = $request->user()?->id ?? null; // logged-in user ID, or null if guest

                // Create the command
        $command = Command::create([
            'name' => trim(($validated['customer_first_name'] ?? '') . ' ' . ($validated['customer_last_name'] ?? '')),
            'user_id' => $userId, // null for guest
            'customer_first_name' => $validated['customer_first_name'],
            'customer_last_name' => $validated['customer_last_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'status' => $validated['status'] ?? 'pending',
            'shipping_address' => $validated['shipping_address'],
            'billing_address' => $validated['billing_address'],
            'payment_method' => $validated['payment_method'] ?? 'cod',
            'source' => $validated['source'] ?? 'website',
            'description' => $validated['description'],
            'desired_delivery_at' => $validated['desired_delivery_at'],
            'placed_at' => now(), // Add placed_at timestamp
            'total' => round($total, 2),
            // Gift card fields
            'has_gift_card' => isset($validated['gift_card']) && $validated['gift_card'] !== null,
            'gift_card_template_id' => $validated['gift_card']['template_id'] ?? null,
            'gift_card_message' => $validated['gift_card']['custom_description'] ?? null,
            'gift_card_signature' => $signatureData['signature'], // Use processed signature (path or text)
            'gift_card_signature_type' => $signatureData['type'], // 'image' or 'text'
            'gift_card_is_custom' => isset($validated['gift_card']['template_id']) ? false : true,
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
        // Send confirmation email to customer (if email provided)
        if (!empty($command->customer_email)) {
            try {
                Mail::to($command->customer_email)->send(new CommandReceivedMail($command));
            } catch (\Throwable $e) {
                Log::error('Order confirmation email failed', [
                    'command_id' => $command->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        // Send admin notification email to configured admin addresses
        try {
            $adminEmails = [
                'ahmedmaatar04@gmail.com',
                'ahmedmaatar03@gmail.com',
            ];
            Mail::to($adminEmails)->send(new AdminCommandNotificationMail($command));
        } catch (\Throwable $e) {
            Log::error('Admin notification email failed', [
                'command_id' => $command->id,
                'error' => $e->getMessage()
            ]);
        }

        return response()->json($command->load(['user', 'products', 'commandProducts.product', 'giftCardTemplate']), 201);
    }

    public function show($id)
    {
        // Return command with user, products (with pivot data), and gift card template
        return Command::with(['user', 'products', 'commandProducts.product', 'giftCardTemplate'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $command = Command::findOrFail($id);
        $validated = $request->validate([
            'customer_first_name' => 'nullable|string|max:255',
            'customer_last_name' => 'nullable|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'status' => 'nullable|string|max:50',
            'shipping_address' => 'nullable|string',
            'billing_address' => 'nullable|string',
            'payment_method' => 'nullable|in:cod,online',
            'source' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'desired_delivery_at' => 'nullable|date',
            'products' => 'nullable|array',
            'products.*.product_id' => 'required_with:products|exists:products,id',
            'products.*.quantity' => 'required_with:products|integer|min:1',
            'products.*.custom_fields' => 'nullable|array',
            'products.*.custom_fields.*.field_id' => 'required_with:products.*.custom_fields|integer',
            'products.*.custom_fields.*.value' => 'required_with:products.*.custom_fields|string',
        ]);

        // Update name if first or last name changed
        $firstName = $validated['customer_first_name'] ?? $command->customer_first_name;
        $lastName = $validated['customer_last_name'] ?? $command->customer_last_name;
        $name = trim($firstName . ' ' . $lastName);

        $command->update([
            'name' => $name,
            'customer_first_name' => $firstName,
            'customer_last_name' => $lastName,
            'customer_email' => $validated['customer_email'] ?? $command->customer_email,
            'customer_phone' => $validated['customer_phone'] ?? $command->customer_phone,
            'status' => $validated['status'] ?? $command->status,
            'shipping_address' => $validated['shipping_address'] ?? $command->shipping_address,
            'billing_address' => $validated['billing_address'] ?? $command->billing_address,
            'payment_method' => $validated['payment_method'] ?? $command->payment_method,
            'source' => $validated['source'] ?? $command->source,
            'description' => $validated['description'] ?? $command->description,
            'desired_delivery_at' => $validated['desired_delivery_at'] ?? $command->desired_delivery_at,
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

        return response()->json($command->load(['user', 'products', 'commandProducts.product', 'giftCardTemplate']));
    }

    public function destroy($id)
    {
        $command = Command::findOrFail($id);
        $command->delete();
        return response()->json(null, 204);
    }
    // Add this method inside CommandController
public function getCommandsByUser($userId)
{
    // Check if user exists
    $user = User::findOrFail($userId);

    // Optional: Add security check to ensure users can only see their own orders
    // $authUser = auth()->user();
    // if ($authUser && $authUser->id != $userId) {
    //     return response()->json(['error' => 'Unauthorized'], 403);
    // }

    // Retrieve all commands for that user, with related products, notes, and status history
    $commands = Command::with([
        'products',
        'commandProducts.product',
        'notes.user',
        'notes.admin',
        'statusHistory.changedBy'
    ])
        ->where('user_id', $userId)
        ->get();

    return response()->json([
        'user' => $user,
        'commands' => $commands
    ]);
}

    /**
     * Get notes for a specific command
     */
    public function getNotes(Request $request, $commandId)
    {
        $command = Command::findOrFail($commandId);

        // Check permissions - users can only see their own order notes
        $user = $request->user();
        if ($user && $command->user_id !== $user->id) {
            // If not the order owner, only show customer-visible notes
            $notes = $command->notes()
                ->visibleToCustomer()
                ->with(['user', 'admin'])
                ->get();
        } else {
            // Show all notes if it's the order owner or admin
            $notes = $command->notes()->with(['user', 'admin'])->get();
        }

        return response()->json([
            'command_id' => $commandId,
            'notes' => $notes
        ]);
    }

    /**
     * Add a note to a command
     */
    public function addNote(Request $request, $commandId)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:2000',
            'note_type' => 'in:customer,admin,system',
            'is_visible_to_customer' => 'boolean'
        ]);

        $command = Command::findOrFail($commandId);
        $user = $request->user();

        // Check if user is authenticated
        if (!$user) {
            return response()->json(['error' => 'Unauthorized - Authentication required'], 403);
        }

        // Determine note type and permissions
        $noteData = [
            'command_id' => $commandId,
            'content' => $validated['content'],
            'note_type' => $validated['note_type'] ?? 'customer',
            'is_visible_to_customer' => $validated['is_visible_to_customer'] ?? true,
        ];

        // Check if the authenticated user is an admin
        // Method 1: Check if user has 'role' attribute set to 'admin'
        $isAdminByRole = isset($user->role) && $user->role === 'admin';

        // Method 2: Check if user email indicates admin (common pattern)
        $isAdminByEmail = str_contains($user->email, 'admin') || str_ends_with($user->email, '@admin.com');

        // Method 3: Check if admin guard is being used
        $isAdminByGuard = $request->user('admin') !== null;

        // Method 4: Check if user exists in admins table (fallback)
        $isAdminByTable = \App\Models\Admin::where('email', $user->email)->exists();

        $isAdmin = $isAdminByRole || $isAdminByEmail || $isAdminByGuard || $isAdminByTable;

        // Debug logging to see which method detects admin
        Log::info('Admin detection debug', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'user_role' => $user->role ?? 'not_set',
            'isAdminByRole' => $isAdminByRole,
            'isAdminByEmail' => $isAdminByEmail,
            'isAdminByGuard' => $isAdminByGuard,
            'isAdminByTable' => $isAdminByTable,
            'final_isAdmin' => $isAdmin,
            'note_type' => $noteData['note_type']
        ]);

        // Authorization logic
        if ($noteData['note_type'] === 'customer') {
            // For customer notes: allow if user is the customer OR if user is admin
            if (!$isAdmin && $command->user_id !== $user->id) {
                return response()->json(['error' => 'Unauthorized - Only order customer or admin can add customer notes'], 403);
            }

            if ($isAdmin) {
                // Admin adding customer-visible note - store as admin note
                $noteData['admin_id'] = $user->id;
                // Keep note_type as 'customer' to make it visible to customer
            } else {
                // Customer adding their own note
                $noteData['user_id'] = $user->id;
            }
        } else {
            // For admin/system notes: only allow if user is admin
            if (!$isAdmin) {
                return response()->json(['error' => 'Unauthorized - Only admins can add admin/system notes'], 403);
            }
            $noteData['admin_id'] = $user->id;
        }

        $note = OrderNote::create($noteData);
        $note->load(['user', 'admin']);

        return response()->json([
            'message' => 'Note added successfully',
            'note' => $note
        ], 201);
    }

    /**
     * Get status history for a command
     */
    public function getStatusHistory($commandId)
    {
        $command = Command::findOrFail($commandId);
        $history = $command->statusHistory()->with('changedBy')->get();

        return response()->json([
            'command_id' => $commandId,
            'current_status' => $command->status,
            'history' => $history
        ]);
    }

    /**
     * Update command status with history tracking
     */
    public function updateStatus(Request $request, $commandId)
    {
        $validated = $request->validate([
            'status' => 'required|string|max:50',
            'notes' => 'nullable|string|max:1000',
            'admin_id' => 'nullable|exists:admins,id'
        ]);

        $command = Command::findOrFail($commandId);

        // Use the model method to update status and create history
        $command->updateStatus(
            $validated['status'],
            $validated['admin_id'] ?? null,
            $validated['notes'] ?? null
        );

        // Load the updated command with relationships
        $command->load([
            'statusHistory.changedBy',
            'notes.user',
            'notes.admin'
        ]);

        return response()->json([
            'message' => 'Status updated successfully',
            'command' => $command
        ]);
    }

    /**
     * Get detailed command information including notes and history
     */
    public function getCommandDetails($commandId)
    {
        $command = Command::with([
            'user',
            'products',
            'commandProducts.product',
            'notes.user',
            'notes.admin',
            'statusHistory.changedBy',
            'giftCardTemplate'
        ])->findOrFail($commandId);

        return response()->json($command);
    }

}
