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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('command_id')->constrained()->cascadeOnDelete();

            $table->string('gateway')->default('sadad');
            $table->string('transaction_number')->nullable();
            $table->integer('transaction_status');
            $table->decimal('amount', 10, 2);

            $table->boolean('is_test')->default(false);
            $table->json('payload'); // FULL webhook data
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
