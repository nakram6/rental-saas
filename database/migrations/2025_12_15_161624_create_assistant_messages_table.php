<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('assistant_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assistant_session_id')->constrained()->cascadeOnDelete();
            $table->string('role', 20); // user|assistant|system
            $table->text('content');
            $table->unsignedInteger('tokens')->nullable();
            $table->string('model', 80)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assistant_messages');
    }
};
