<?php
// app/Models/CustomField.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CustomField extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'name', 'type', 'options', 'is_required', 'affects_price', 'price_type', 'price_value'
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean',
        'affects_price' => 'boolean',
        'price_value' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function productCustomValues()
    {
        return $this->hasMany(ProductCustomValue::class);
    }
}
