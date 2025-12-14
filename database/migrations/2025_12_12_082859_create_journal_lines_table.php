<?php

// 2025_12_12_000003_create_journal_lines_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('journal_lines', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('tenant_id')->index();
      $table->unsignedBigInteger('journal_entry_id')->index();
      $table->unsignedBigInteger('account_id')->index();
      $table->unsignedBigInteger('customer_id')->nullable()->index();
      $table->unsignedBigInteger('booking_id')->nullable()->index();

      $table->decimal('debit', 12, 2)->default(0);
      $table->decimal('credit', 12, 2)->default(0);

      $table->string('description')->nullable();
      $table->timestamps();

      $table->foreign('journal_entry_id')->references('id')->on('journal_entries')->cascadeOnDelete();
      $table->foreign('account_id')->references('id')->on('accounts');
    });
  }

  public function down(): void {
    Schema::dropIfExists('journal_lines');
  }
};
