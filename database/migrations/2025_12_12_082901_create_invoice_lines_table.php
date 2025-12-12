<?php

// 2025_12_12_000005_create_invoice_lines_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('invoice_lines', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('tenant_id')->index();
      $table->unsignedBigInteger('invoice_id')->index();

      $table->string('category')->default('rental'); // rental/delivery/deposit/latefee/damage
      $table->string('description');
      $table->decimal('qty', 10, 2)->default(1);
      $table->decimal('unit_price', 12, 2)->default(0);
      $table->decimal('line_total', 12, 2)->default(0);

      $table->timestamps();

      $table->foreign('invoice_id')->references('id')->on('invoices')->cascadeOnDelete();
    });
  }

  public function down(): void {
    Schema::dropIfExists('invoice_lines');
  }
};
