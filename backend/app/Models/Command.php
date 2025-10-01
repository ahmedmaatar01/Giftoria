<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Command extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total',
        'status',
        'shipping_address',
        'billing_address',
        'placed_at',
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
            ->withPivot('quantity', 'price_at_order_time')
            ->withTimestamps();
    }
}
