<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();

            // tenant scoping (recommended)
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();

            // optional user (admin who created it)
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            $table->string('quote_no')->unique(); // e.g. Q-2025-000123
            $table->date('event_date')->nullable();
            $table->string('city')->nullable();
            $table->string('venue')->nullable();
            $table->string('event_type')->nullable();
            $table->unsignedInteger('guest_count')->nullable();
            $table->string('theme_colors')->nullable();

            $table->decimal('budget', 10, 2)->nullable();
            $table->text('notes')->nullable();

            $table->string('status')->default('draft'); // draft/sent/approved/rejected
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);

            $table->string('pdf_path')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
