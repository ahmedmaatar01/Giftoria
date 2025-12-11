<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('home_page_details', function (Blueprint $table) {
            $table->id();
            // Only one of these should be set, based on hero_type
            $table->enum('hero_type', ['image', 'video'])->default('image'); // Indicates which hero media is used
            $table->string('hero_media')->nullable(); // Path or URL to hero image or video
            $table->string('hero_title_en'); // Hero title in English
            $table->string('hero_title_ar'); // Hero title in Arabic
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_page_details');
    }
};
