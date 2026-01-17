<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ContactMessageMail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000',
        ]);

        try {
            $adminEmails = [
                'giftoriagifts@gmail.com',
                'giftoriagifts@gmail.com',
            ];
            Mail::to($adminEmails)->send(new ContactMessageMail($validated));
        } catch (\Throwable $e) {
            Log::error('Contact form email failed', [
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message.'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully.'
        ], 201);
    }
}
