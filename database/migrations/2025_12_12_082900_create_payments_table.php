<?php

// 2025_12_12_000006_create_payments_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('payments', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('tenant_id')->index();
      $table->unsignedBigInteger('customer_id')->index();
      $table->unsignedBigInteger('invoice_id')->nullable()->index();

      $table->date('payment_date')->index();
      $table->decimal('amount', 12, 2);
      $table->string('method')->nullable(); // cash/card/etransfer
      $table->string('reference')->nullable();
      $table->string('status')->default('posted'); // posted/void
      $table->timestamps();
    });
  }

  public function down(): void {
    Schema::dropIfExists('payments');
  }
};
