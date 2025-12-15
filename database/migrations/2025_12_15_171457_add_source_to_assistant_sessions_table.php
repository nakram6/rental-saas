<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('assistant_sessions', function (Blueprint $table) {
            if (!Schema::hasColumn('assistant_sessions', 'source')) {
                $table->string('source', 50)->default('public')->after('tenant_name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('assistant_sessions', function (Blueprint $table) {
            if (Schema::hasColumn('assistant_sessions', 'source')) {
                $table->dropColumn('source');
            }
        });
    }
};
