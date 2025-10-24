<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('occasions', function (Blueprint $table) {
            $table->text('arabic_description')->nullable()->after('description');
        });
    }

    public function down()
    {
        Schema::table('occasions', function (Blueprint $table) {
            $table->dropColumn('arabic_description');
        });
    }

};
