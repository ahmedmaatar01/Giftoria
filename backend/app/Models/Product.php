<?php
// app/Models/Product.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'name', 'description', 'price', 'stock', 'featured_image'
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
