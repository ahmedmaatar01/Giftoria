<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Get all payments
     */
    public function index(Request $request)
    {
        $payments = Payment::orderBy('created_at', 'desc')->paginate(20);

        return response()->json($payments);
    }
}
