<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('commands', function (Blueprint $table) {
            $table->unsignedBigInteger('seen_by_admin')->nullable()->after('user_id');
        });
        Schema::table('order_notes', function (Blueprint $table) {
            $table->unsignedBigInteger('seen_by_admin')->nullable()->after('admin_id');
        });
    }

    public function down()
    {
        Schema::table('commands', function (Blueprint $table) {
            $table->dropColumn('seen_by_admin');
        });
        Schema::table('order_notes', function (Blueprint $table) {
            $table->dropColumn('seen_by_admin');
        });
    }
};
