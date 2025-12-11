<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomePageDetail extends Model
{
    use HasFactory;

    protected $table = 'home_page_details';

    protected $fillable = [
        'hero_type',
        'hero_media',
        'hero_title_en',
        'hero_title_ar',
    ];
}
