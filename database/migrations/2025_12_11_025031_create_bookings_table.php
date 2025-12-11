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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->date('event_date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();

            $table->string('client_name');
            $table->string('client_phone')->nullable();
            $table->string('event_type')->nullable();  // e.g. Mehndi, Baraat, Walima
            $table->unsignedInteger('guest_count')->nullable();

            $table->text('notes')->nullable();
            $table->string('status')->default('pending'); // pending / confirmed / cancelled

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
