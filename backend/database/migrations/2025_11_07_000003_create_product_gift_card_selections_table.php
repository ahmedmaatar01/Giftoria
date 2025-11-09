<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_gift_card_selections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('gift_card_id')->constrained()->onDelete('cascade'); // Template ID
            $table->text('custom_description')->nullable(); // User's custom description
            $table->text('custom_signing')->nullable(); // User's custom signing
            $table->string('customer_email')->nullable(); // For order tracking
            $table->string('session_id')->nullable(); // For anonymous users
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_gift_card_selections');
    }
};