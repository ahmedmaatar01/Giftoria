<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('occasion_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('occasion_id');
            $table->string('image_path');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();

            $table->foreign('occasion_id')->references('id')->on('occasions')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('occasion_images');
    }
};
