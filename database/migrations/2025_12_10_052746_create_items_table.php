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
    Schema::create('items', function (Blueprint $table) {
        $table->id();

        // 👇 this is the missing column + FK
        $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();

        $table->string('name');
        $table->string('sku')->nullable();
        $table->text('description')->nullable();

        $table->enum('rental_type', ['bulk', 'trackable'])->default('bulk');
        $table->integer('qty_total')->default(1);
        $table->decimal('price_per_day', 10, 2)->default(0);
        $table->decimal('security_deposit', 10, 2)->default(0);

        $table->boolean('is_active')->default(true);
        $table->json('meta')->nullable();

        $table->timestamps();

        $table->index(['tenant_id', 'name']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
