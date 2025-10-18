<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommandProduct extends Model
{
    use HasFactory;

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    protected $fillable = [
        'command_id',
        'product_id',
        'quantity',
        'price_at_order_time',
        'custom_fields',
        'unit_price',
        'line_total',
    ];

    protected $casts = [
        'custom_fields' => 'array',
        'price_at_order_time' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'line_total' => 'decimal:2',
    ];
}
