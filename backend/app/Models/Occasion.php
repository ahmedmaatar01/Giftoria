<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Occasion extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'arabic_name',
        'slug',
        'description',
        'arabic_description',
        'show_menu',
        'featured_image',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'occasion_category');
    }

    public function images()
    {
        return $this->hasMany(OccasionImage::class);
    }
}
