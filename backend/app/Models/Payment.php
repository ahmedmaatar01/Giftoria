<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'command_id',
        'gateway',
        'transaction_number',
        'transaction_status',
        'amount',
        'is_test',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
    ];
}
