<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Command;
use App\Services\SadadService;


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
            'CALLBACK_URL' => route('sadad.callback'),
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
        $data['signature'] = SadadService::generateSignature(
            $data,
            config('sadad.secret_key')
        );

        // 4️⃣ Redirect to SADAD
        return response()->view('sadad.redirect', [
            'url'  => config('sadad.payment_url'),
            'data' => $data
        ]);
    }


    /**
     * STEP 2: Callback (User redirect)
     */
    public function callback(Request $request)
    {
        Log::info('SADAD CALLBACK', $request->all());

        $isValid = SadadService::verifySignature(
            $request->all(),
            config('sadad.secret_key')
        );

        if (!$isValid) {
            return redirect('/payment-failed?reason=invalid_signature');
        }

        $orderId = $request->ORDER_ID ?? null;

        if (!$orderId) {
            return redirect('/payment-failed');
        }

        if (($request->STATUS ?? '') === 'TXN_SUCCESS') {
            return redirect('/payment-success?order_id=' . $orderId);
        }

        return redirect('/payment-failed?order_id=' . $orderId);
    }

    /**
     * STEP 3: Webhook (Server to Server)
     */
    public function webhook(Request $request)
    {
        Log::info('SADAD WEBHOOK', $request->all());

        $isValid = SadadService::verifySignature(
            $request->all(),
            config('sadad.secret_key')
        );

        if (!$isValid) {
            Log::warning('Invalid SADAD webhook signature');
            return response()->json(['status' => 'invalid_signature'], 403);
        }

        $orderId = $request->ORDER_ID ?? null;

        if (!$orderId) {
            return response()->json(['status' => 'order_not_found'], 400);
        }

        $order = Command::find($orderId);

        if (!$order) {
            return response()->json(['status' => 'order_not_found'], 404);
        }

        // Prevent double processing
        if ($order->status === 'paid') {
            return response()->json(['status' => 'already_processed'], 200);
        }

        if (($request->STATUS ?? '') === 'TXN_SUCCESS') {

            // Verify amount
            if ((float)$request->TXN_AMOUNT != (float)$order->total) {
                Log::error('Amount mismatch', [
                    'order_id' => $order->id,
                    'sadad'    => $request->TXN_AMOUNT,
                    'order'    => $order->total
                ]);

                return response()->json(['status' => 'amount_mismatch'], 400);
            }

            $order->update([
                'status'            => 'paid',
                'payment_reference' => $request->TXN_ID ?? null,
                'paid_at'           => now()
            ]);

            return response()->json(['status' => 'success'], 200);
        }

        // Payment failed
        $order->update([
            'status' => 'failed'
        ]);

        return response()->json(['status' => 'failed'], 200);
    }
}
