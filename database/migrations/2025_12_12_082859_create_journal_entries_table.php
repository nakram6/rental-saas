<?php

// 2025_12_12_000002_create_journal_entries_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('journal_entries', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('tenant_id')->index();
      $table->date('entry_date')->index();
      $table->string('reference_type')->nullable(); // Invoice, Payment, etc.
      $table->unsignedBigInteger('reference_id')->nullable();
      $table->string('memo')->nullable();
      $table->unsignedBigInteger('posted_by')->nullable();
      $table->timestamps();

      $table->index(['tenant_id', 'reference_type', 'reference_id']);
    });
  }

  public function down(): void {
    Schema::dropIfExists('journal_entries');
  }
};
