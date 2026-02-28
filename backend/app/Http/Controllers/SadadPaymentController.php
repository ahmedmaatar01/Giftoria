<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Command;
use App\Services\SadadService;
use App\Models\Payment;


class SadadPaymentController extends Controller
{
    /**
     * STEP 1: Initialize SADAD payment
     */
    public function init(Request $request)
    {
        $request->validate([
            'order_id' => 'required|integer'
        ]);

        $order = Command::findOrFail($request->order_id);

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Order already processed'], 400);
        }

        // 1️⃣ Build payload
        $data = [
            'merchant_id'  => config('sadad.merchant_id'),
            'ORDER_ID'     => $order->id,
            'TXN_AMOUNT'   => number_format($order->total, 2, '.', ''),
            'WEBSITE'      => 'giftoria.me', // DOMAIN ONLY
            'CALLBACK_URL' => secure_url(route('sadad.callback', [], false)),
            'MOBILE_NO'    => $order->customer_phone ?? '77778888',
            'EMAIL'        => $order->customer_email ?? 'test@test.com',
            'txnDate'      => now()->format('Y-m-d H:i:s'),
            'VERSION'      => '1.1', // ✅ REQUIRED
        ];

        // 2️⃣ productdetail (NOT included in signature)
        $data['productdetail[0][order_id]'] = $order->id;
        $data['productdetail[0][amount]']   = number_format($order->total, 2, '.', '');
        $data['productdetail[0][quantity]'] = 1;

        Log::info('SADAD INIT PAYLOAD (before signature)', $data);

        // 3️⃣ SIGNATURE (MUST BE LAST)
        $signatureData = [
            'merchant_id' => $data['merchant_id'],
            'ORDER_ID' => $data['ORDER_ID'],
            'TXN_AMOUNT' => $data['TXN_AMOUNT'],
            'WEBSITE' => $data['WEBSITE'],
            'CALLBACK_URL' => $data['CALLBACK_URL'],
            'MOBILE_NO' => $data['MOBILE_NO'],
            'EMAIL' => $data['EMAIL'],
            'txnDate' => $data['txnDate'],
            'VERSION' => $data['VERSION'],
        ];

        $data['signature'] = SadadService::generateSignature(
            $signatureData,
            config('sadad.secret_key')
        );

        // 4️⃣ Return data for frontend
        $responseData = [
            'merchant_id' => $data['merchant_id'],
            'order_id' => $data['ORDER_ID'],
            'amount' => $data['TXN_AMOUNT'],
            'website' => $data['WEBSITE'],
            'callback' => $data['CALLBACK_URL'],
            'txnDate' => $data['txnDate'],
            'version' => $data['VERSION'],
            'signature' => $data['signature'],
        ];
        
        Log::info('SADAD INIT response data', $responseData);
        
        return response()->json($responseData);

    }

    /**
     * Render SADAD payment page
     */
    public function pay(Request $request)
    {
        $request->validate([
            'order_id' => 'required|integer'
        ]);
        Log::info('secret key is: ', ['key' => config('sadad.secret_key')]);
        $order = Command::findOrFail($request->order_id);

        if ($order->status !== 'pending') {
            abort(400, 'Order already processed');
        }

        // Build payload same as init
        $data = [
            'merchant_id'  => config('sadad.merchant_id'),
            'ORDER_ID'     => $order->id,
            'TXN_AMOUNT'   => number_format($order->total, 2, '.', ''),
            'WEBSITE'      => 'giftoria.me',
            'CALLBACK_URL' => secure_url(route('sadad.callback', [], false)),
            'MOBILE_NO'    => str_replace(' ', '', $order->customer_phone ?? '77778888'),
            'EMAIL'        => $order->customer_email ?? 'test@test.com',
            'txnDate'      => now()->format('Y-m-d H:i:s'),
            'VERSION'      => '1.1',
        ];

        $data['productdetail[0][order_id]'] = $order->id;
        $data['productdetail[0][amount]']   = number_format($order->total, 2, '.', '');
        $data['productdetail[0][quantity]'] = 1;

        $signatureData = [
            'merchant_id' => $data['merchant_id'],
            'ORDER_ID' => $data['ORDER_ID'],
            'TXN_AMOUNT' => $data['TXN_AMOUNT'],
            'WEBSITE' => $data['WEBSITE'],
            'CALLBACK_URL' => $data['CALLBACK_URL'],
            'MOBILE_NO' => $data['MOBILE_NO'],
            'EMAIL' => $data['EMAIL'],
            'txnDate' => $data['txnDate'],
            'VERSION' => $data['VERSION'],
        ];

        $data['signature'] = SadadService::generateSignature(
            $signatureData,
            config('sadad.secret_key')
        );

        Log::info('SADAD PAY page rendered for order', ['order_id' => $order->id]);

        return view('sadad.pay', compact('data'));
    }
    private function getSadadOrderId(Request $request)
    {
        return
            $request->ORDERID
            ?? $request->ORDER_ID
            ?? $request->website_ref_no
            ?? $request->websiteRefNo
            ?? null;
    }
    public function checksum(Request $request)
    {
        $sadadKey = config('sadad.secret_key');
        $isTestKey = $sadadKey === env('SADAD_SECRET_KEY_TEST');
        Log::info('SADAD KEY USAGE', ['key_type' => $isTestKey ? 'test' : 'live', 'key_value' => $sadadKey]);
        Log::info('SADAD CHECKSUM called', ['data' => $request->all()]);
        
        $data = $request->all();

        // Remove signature from request data if present
        unset($data['signature'], $data['CHECKSUMHASH'], $data['checksumhash']);

        if (!isset($data['merchant_id'], $data['ORDER_ID'], $data['TXN_AMOUNT'], $data['WEBSITE'], $data['CALLBACK_URL'])) {
            Log::error('SADAD CHECKSUM missing required fields');
            return response()->json(['message' => 'Missing required SADAD fields'], 422);
        }

        if (empty($data['txnDate'])) {
            $data['txnDate'] = now()->format('Y-m-d H:i:s');
        }

        // Build signature with only the required fields, in order
        $signatureData = [
            'merchant_id' => $data['merchant_id'],
            'ORDER_ID' => $data['ORDER_ID'],
            'TXN_AMOUNT' => $data['TXN_AMOUNT'],
            'WEBSITE' => $data['WEBSITE'],
            'CALLBACK_URL' => $data['CALLBACK_URL'],
            'MOBILE_NO' => $data['MOBILE_NO'] ?? '',
            'EMAIL' => $data['EMAIL'] ?? '',
            'txnDate' => $data['txnDate'],
            'VERSION' => $data['VERSION'],
        ];

        $signature = SadadService::generateSignature(
            $signatureData,
            config('sadad.secret_key')
        );

        Log::info('SADAD CHECKSUM signature data', ['signature_data' => $signatureData, 'signature' => $signature]);

        $actionUrl = config('sadad.payment_url');
        if (!$actionUrl) {
            return response()->json(['message' => 'SADAD payment_url not configured'], 500);
        }

        $fields = $data;
        $fields['signature'] = $signature; // SADAD SDK expects 'signature' field

        // Build form HTML - SADAD requires HTML response, not JSON
        $inputs = '';
        foreach ($fields as $key => $value) {
            if ($value === null || $value === '') {
                continue;
            }
            if (is_array($value)) {
                foreach ($value as $subKey => $subValue) {
                    if (is_array($subValue)) {
                        foreach ($subValue as $nestedKey => $nestedValue) {
                            $fullKey = "{$key}[{$subKey}][{$nestedKey}]";
                            $safeKey = htmlspecialchars($fullKey, ENT_QUOTES, 'UTF-8');
                            $safeValue = htmlspecialchars((string) $nestedValue, ENT_QUOTES, 'UTF-8');
                            $inputs .= "<input type=\"hidden\" name=\"{$safeKey}\" value=\"{$safeValue}\">\n";
                        }
                    } else {
                        $fullKey = "{$key}[{$subKey}]";
                        $safeKey = htmlspecialchars($fullKey, ENT_QUOTES, 'UTF-8');
                        $safeValue = htmlspecialchars((string) $subValue, ENT_QUOTES, 'UTF-8');
                        $inputs .= "<input type=\"hidden\" name=\"{$safeKey}\" value=\"{$safeValue}\">\n";
                    }
                }
                continue;
            }
            $safeKey = htmlspecialchars((string) $key, ENT_QUOTES, 'UTF-8');
            $safeValue = htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
            $inputs .= "<input type=\"hidden\" name=\"{$safeKey}\" value=\"{$safeValue}\">\n";
        }

        // Return form HTML as required by SADAD SDK
        $html = '<form id="sadadFinalForm" method="post">' . $inputs . '</form>';

        Log::info('SADAD CHECKSUM response HTML', ['signature' => $signature]);
        
        return response($html, 200)->header('Content-Type', 'text/html');
    }

    /**
     * Handle Direct Payment success callback
     */
    public function paymentSuccess(Request $request)
    {
        Log::info('SADAD Direct Payment Success', $request->all());

        $orderId = $request->ORDER_ID ?? $request->order_id;
        if (!$orderId) {
            return response()->json(['error' => 'Order ID missing'], 400);
        }

        $order = Command::find($orderId);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        // Create payment record
        Payment::create([
            'command_id'         => $order->id,
            'gateway'            => 'sadad',
            'transaction_number' => $request->transactionNumber ?? $request->transaction_id,
            'transaction_status' => $request->transactionStatus ?? 'success',
            'amount'             => $order->total,
            'is_test'            => config('sadad.mode') === 'test',
            'payload'            => $request->all(),
        ]);

        // Update order status
        $order->update([
            'status' => 'paid',
            'payment_reference' => $request->transactionNumber ?? $request->transaction_id,
            'paid_at' => now()
        ]);

        return response()->json(['success' => true, 'order_id' => $orderId]);
    }


    /**
     * STEP 2: Callback (User redirect)
     */
    public function callback(Request $request)
    {
        Log::info('SADAD CALLBACK - FULL RESPONSE', [
            'all' => $request->all(),
            'query' => $request->query(),
            'method' => $request->method(),
            'headers' => $request->headers->all(),
            'raw' => $request->getContent(),
        ]);

        $orderId = $this->getSadadOrderId($request);

        if (!$orderId) {
            return redirect('https://giftoria.me/payment-failed');
        }

        $order = Command::find($orderId);
        if (!$order) {
            return redirect('https://giftoria.me/payment-failed');
        }

        // Create payment record
        try {
            $txnStatus = $request->transactionStatus ?? $request->status ?? 2; // 2 = failed/pending
            if (!is_numeric($txnStatus)) {
                $txnStatus = 2;
            } else {
                $txnStatus = (int)$txnStatus;
            }
            Payment::create([
                'command_id'         => $order->id,
                'gateway'            => 'sadad',
                'transaction_number' => $request->transactionNumber ?? $request->transaction_id ?? 'N/A',
                'transaction_status' => $txnStatus,
                'amount'             => $order->total,
                'is_test'            => config('sadad.mode') === 'test',
                'payload'            => $request->all(),
            ]);
            Log::info('SADAD CALLBACK payment saved', ['order_id' => $orderId]);
        } catch (\Exception $e) {
            Log::error('SADAD CALLBACK payment save failed', ['error' => $e->getMessage()]);
        }

        // Update order if payment successful
        if (isset($request->transactionStatus) && (int)$request->transactionStatus === 3) {
            $order->update([
                'status' => 'paid',
                'payment_reference' => $request->transactionNumber ?? $request->transaction_id,
                'paid_at' => now()
            ]);
            Log::info('SADAD CALLBACK order marked as paid', ['order_id' => $orderId]);
        }

        return redirect('https://giftoria.me/payment-processing?order_id=' . $orderId);
    }



    /**
     * STEP 3: Webhook (Server to Server)
     */
    public function webhook(Request $request)
    {
        $sadadKey = config('sadad.secret_key');
        $isTestKey = $sadadKey === env('SADAD_SECRET_KEY_TEST');
        Log::info('SADAD KEY USAGE WEBHOOK', ['key_type' => $isTestKey ? 'test' : 'live', 'key_value' => $sadadKey]);
        Log::info('SADAD WEBHOOK', $request->all());

        $data = $request->all();
        $receivedChecksum = $data['checksumhash'] ?? $data['checksumHash'] ?? null;
        // Remove checksumhash from the data before generating the hash
        unset($data['checksumhash'], $data['checksumHash']);

        // Sort the data by keys alphabetically
        $sortedKeys = array_keys($data);
        sort($sortedKeys);
        $sortedData = [];
        foreach ($sortedKeys as $key) {
            $sortedData[$key] = $data[$key];
        }

        // Build the string: secret key + values of sorted data
        $string = config('sadad.secret_key');
        foreach ($sortedData as $value) {
            $string .= $value;
        }
        $expectedChecksum = hash('sha256', $string);

        // Debug logs for troubleshooting
        Log::info('SADAD WEBHOOK CHECKSUM DEBUG', [
            'received_payload' => $request->all(),
            'sorted_keys' => $sortedKeys,
            'pre_hash_string' => $string,
            'expected_checksum' => $expectedChecksum,
            'received_checksum' => $receivedChecksum
        ]);

        if ($expectedChecksum !== $receivedChecksum) {
            Log::warning('Invalid SADAD checksum', [
                'received_checksum' => $receivedChecksum,
                'expected_checksum' => $expectedChecksum,
                'request' => $request->all(),
                'sorted_keys' => $sortedKeys,
                'pre_hash_string' => $string
            ]);
            return response()->json([
                'status' => 'invalid_checksum',
                'received_checksum' => $receivedChecksum,
                'expected_checksum' => $expectedChecksum
            ], 403);
        }

        $orderId = $this->getSadadOrderId($request);
        Log::info('SADAD WEBHOOK orderId resolved', ['orderId' => $orderId]);
        $order = Command::find($orderId);

        if (!$order) {
            Log::error('SADAD WEBHOOK order not found', ['orderId' => $orderId]);
            return response()->json(['status' => 'order_not_found'], 404);
        }

        try {
            $payment = Payment::create([
                'command_id'         => $order->id,
                'gateway'            => 'sadad',
                'transaction_number' => $request->transactionNumber,
                'transaction_status' => $request->transactionStatus,
                'amount'             => $request->txnAmount,
                'is_test'            => (bool) $request->isTestMode,
                'payload'            => $request->all(),
            ]);
            Log::info('SADAD WEBHOOK payment created', [
                'payment_id' => $payment->id,
                'command_id' => $order->id,
                'transaction_number' => $request->transactionNumber,
                'transaction_status' => $request->transactionStatus,
                'amount' => $request->txnAmount,
                'is_test' => (bool) $request->isTestMode,
            ]);
        } catch (\Exception $e) {
            Log::error('SADAD WEBHOOK payment creation failed', [
                'error' => $e->getMessage(),
                'order_id' => $order->id,
                'request' => $request->all(),
            ]);
            return response()->json(['status' => 'payment_creation_failed', 'error' => $e->getMessage()], 500);
        }

        // Success only if status === 3
        if ((int)$request->transactionStatus === 3) {
            if ($order->status !== 'paid') {
                $order->update([
                    'status'            => 'paid',
                    'payment_reference' => $request->transactionNumber,
                    'paid_at'           => now()
                ]);
                Log::info('SADAD WEBHOOK order marked as paid', [
                    'order_id' => $order->id,
                    'transaction_number' => $request->transactionNumber
                ]);
            }
        }

        return response()->json(['status' => 'success'], 200);
    }

    public function redirect(Request $request)
    {
        Log::critical('SADAD REDIRECT FULL PAYLOAD', [
            'all' => $request->all(),
            'query' => $request->query(),
            'method' => $request->method(),
        ]);

        $orderId = $this->getSadadOrderId($request);


        if (!$orderId) {
            return redirect('https://giftoria.me/payment-failed');
        }

        return redirect(
            'https://giftoria.me/payment-processing?order_id=' . $orderId
        );
    }


}
