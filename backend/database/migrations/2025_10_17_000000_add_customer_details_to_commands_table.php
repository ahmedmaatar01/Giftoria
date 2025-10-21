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
            if (!Schema::hasColumn('commands', 'customer_first_name')) {
                $table->string('customer_first_name')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('commands', 'customer_last_name')) {
                $table->string('customer_last_name')->nullable()->after('customer_first_name');
            }
            if (!Schema::hasColumn('commands', 'customer_email')) {
                $table->string('customer_email')->nullable()->after('customer_last_name');
            }
            if (!Schema::hasColumn('commands', 'customer_phone')) {
                $table->string('customer_phone')->nullable()->after('customer_email');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('commands', function (Blueprint $table) {
            $columns = ['customer_first_name', 'customer_last_name', 'customer_email', 'customer_phone'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('commands', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
