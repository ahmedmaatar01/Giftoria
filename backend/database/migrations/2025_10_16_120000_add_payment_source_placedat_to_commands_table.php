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
        Schema::table('commands', function (Blueprint $table) {
            if (!Schema::hasColumn('commands', 'placed_at')) {
                $table->timestamp('placed_at')->nullable()->after('billing_address');
            }
            if (!Schema::hasColumn('commands', 'payment_method')) {
                $table->string('payment_method', 50)->nullable()->after('placed_at'); // 'cod' | 'online'
            }
            if (!Schema::hasColumn('commands', 'source')) {
                $table->string('source', 50)->default('website')->after('payment_method');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('commands', function (Blueprint $table) {
            if (Schema::hasColumn('commands', 'source')) {
                $table->dropColumn('source');
            }
            if (Schema::hasColumn('commands', 'payment_method')) {
                $table->dropColumn('payment_method');
            }
            if (Schema::hasColumn('commands', 'placed_at')) {
                $table->dropColumn('placed_at');
            }
        });
    }
};
