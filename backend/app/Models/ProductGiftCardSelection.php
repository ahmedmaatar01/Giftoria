<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductGiftCardSelection extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'gift_card_id',
        'custom_description',
        'custom_signing',
        'customer_email',
        'session_id',
    ];

    /**
     * Get the product that this selection belongs to.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the gift card template that this selection uses.
     */
    public function giftCard(): BelongsTo
    {
        return $this->belongsTo(GiftCard::class);
    }
}