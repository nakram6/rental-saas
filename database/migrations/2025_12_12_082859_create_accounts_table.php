<?php

// database/migrations/2025_12_12_000001_create_accounts_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('accounts', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('tenant_id')->index();
      $table->string('code', 30)->nullable(); // e.g., 1100
      $table->string('name');                // e.g., Accounts Receivable
      $table->string('type');                // asset/liability/income/expense/equity
      $table->boolean('is_system')->default(true);
      $table->timestamps();

      $table->unique(['tenant_id', 'name']);
    });
  }

  public function down(): void {
    Schema::dropIfExists('accounts');
  }
};
