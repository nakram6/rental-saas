<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('assistant_sessions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->nullable()->index(); // if you have tenant_id
            $table->string('tenant_name', 120)->nullable();
            $table->string('channel', 40)->default('public'); // public/admin
            $table->string('visitor_id', 120)->nullable()->index(); // browser visitor id
            $table->timestamp('last_message_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assistant_sessions');
    }
};
