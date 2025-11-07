<?php
// app/Models/Product.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'name','arabic_name', 'description', 'arabic_description', 'price', 'stock', 'featured_image', 'featured', 'lead_time'
    ];

    // Append virtual attribute custom_fields to JSON output
    protected $appends = ['custom_fields'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function customValues()
    {
        return $this->hasMany(ProductCustomValue::class);
    }

    /**
     * Get the gift cards associated with this product.
     */
    public function giftCards()
    {
        return $this->belongsToMany(GiftCard::class, 'product_gift_cards')
                    ->withTimestamps();
    }

    /**
     * Check if this product has any gift cards.
     */
    public function hasGiftCards()
    {
        return $this->giftCards()->exists();
    }

    /**
     * Accessor: expose category custom fields directly on product as custom_fields
     */
    public function getCustomFieldsAttribute()
    {
        // Ensure relation is loaded; if not, try loading category.customFields lazily
        if (!$this->relationLoaded('category')) {
            $this->load('category');
        }
        if ($this->category && !$this->category->relationLoaded('customFields')) {
            $this->category->load('customFields');
        }
        return $this->category ? $this->category->customFields : collect();
    }
}
