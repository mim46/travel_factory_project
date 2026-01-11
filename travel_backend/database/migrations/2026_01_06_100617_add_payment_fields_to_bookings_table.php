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
        Schema::table('bookings', function (Blueprint $table) {
            $table->decimal('total_price', 10, 2)->after('special_request');
            $table->string('payment_method')->nullable()->after('total_price');
            $table->enum('payment_status', ['pending', 'completed', 'failed', 'cancelled'])->default('pending')->after('payment_method');
            $table->string('transaction_id')->nullable()->after('payment_status');
            $table->text('payment_details')->nullable()->after('transaction_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['total_price', 'payment_method', 'payment_status', 'transaction_id', 'payment_details']);
        });
    }
};
