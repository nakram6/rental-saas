<?php

// 2025_12_12_000004_create_invoices_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('invoices', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('tenant_id')->index();
      $table->unsignedBigInteger('customer_id')->index();
      $table->unsignedBigInteger('booking_id')->nullable()->index();

      $table->string('invoice_no')->index(); // e.g., INV-000123
      $table->date('issue_date')->index();
      $table->date('due_date')->nullable()->index();

      $table->decimal('subtotal', 12, 2)->default(0);
      $table->decimal('discount', 12, 2)->default(0);
      $table->decimal('tax', 12, 2)->default(0);
      $table->decimal('total', 12, 2)->default(0);

      $table->string('status')->default('draft'); // draft/sent/paid/void
      $table->text('notes')->nullable();

      $table->timestamps();

      $table->unique(['tenant_id', 'invoice_no']);
    });
  }

  public function down(): void {
    Schema::dropIfExists('invoices');
  }
};
