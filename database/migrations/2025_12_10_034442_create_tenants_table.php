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
    Schema::create('tenants', function (Blueprint $table) {
        $table->id();
        $table->string('name');                // e.g. "Harbour Decor Rentals"
        $table->string('slug')->unique();      // e.g. "harbour-decor"
        $table->string('industry_type')->nullable(); // e.g. "event_decor", "camera_rental"
        $table->string('timezone')->default('America/Toronto');
        $table->json('settings')->nullable();  // branding, config, etc.
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
