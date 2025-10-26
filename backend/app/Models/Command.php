<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Command extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'customer_first_name',
        'customer_last_name',
        'customer_email',
        'customer_phone',
        'total',
        'status',
        'shipping_address',
        'billing_address',
        'placed_at',
        'desired_delivery_at',
        'payment_method',
        'source',
        'description'
    ];

    protected $casts = [
        'placed_at' => 'datetime',
        'desired_delivery_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function commandProducts()
    {
        return $this->hasMany(CommandProduct::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'command_products')
            ->withPivot('quantity', 'price_at_order_time', 'custom_fields', 'unit_price', 'line_total')
            ->withTimestamps();
    }
}
