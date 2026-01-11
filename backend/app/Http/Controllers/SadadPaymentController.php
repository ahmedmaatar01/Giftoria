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
            'CALLBACK_URL' => route('sadad.callback'),
            'REDIRECT_URL' => route('sadad.redirect'),
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
    private function getSadadOrderId(Request $request)
    {
        return
            $request->ORDERID
            ?? $request->ORDER_ID
            ?? $request->website_ref_no
            ?? $request->websiteRefNo
            ?? null;
    }


    /**
     * STEP 2: Callback (User redirect)
     */
    public function callback(Request $request)
    {
        Log::info('SADAD CALLBACK', $request->all());

        $orderId = $this->getSadadOrderId($request);


        if (!$orderId) {
            return redirect('https://giftoria.me/payment-failed');

        }

        // ❌ Do NOT check payment status here
        // ❌ Do NOT verify signature here

        return redirect(
            'https://giftoria.me/payment-processing?order_id=' . $orderId
        );

    }



    /**
     * STEP 3: Webhook (Server to Server)
     */
    public function webhook(Request $request)
    {
        Log::info('SADAD WEBHOOK', $request->all());

        if (!SadadService::verifyChecksum($request->all(), config('sadad.secret_key'))) {
            Log::warning('Invalid SADAD checksum', [
                'request' => $request->all()
            ]);
            return response()->json(['status' => 'invalid_checksum'], 403);
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
