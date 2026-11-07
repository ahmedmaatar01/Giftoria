<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * The global Sanctum limit went from 5 hours to 30 days. Tokens issued before
     * that have no expiry of their own, so keep them on their original 5 hours.
     */
    public function up(): void
    {
        DB::table('personal_access_tokens')
            ->whereNull('expires_at')
            ->update(['expires_at' => DB::raw('DATE_ADD(created_at, INTERVAL 300 MINUTE)')]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
