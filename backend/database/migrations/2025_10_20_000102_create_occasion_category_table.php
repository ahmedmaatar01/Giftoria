<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('occasion_category', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('occasion_id');
            $table->unsignedBigInteger('category_id');
            $table->timestamps();

            $table->foreign('occasion_id')->references('id')->on('occasions')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->unique(['occasion_id', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('occasion_category');
    }
};
