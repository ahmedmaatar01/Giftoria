<?php
// app/Models/Category.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'parent_id', 'show_menu', 'featured_image'
    ];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function customFields()
    {
        return $this->hasMany(CustomField::class);
    }

    public function images()
    {
        return $this->hasMany(CategoryImage::class);
    }

    public function occasions()
    {
        return $this->belongsToMany(Occasion::class, 'occasion_category');
    }
}
