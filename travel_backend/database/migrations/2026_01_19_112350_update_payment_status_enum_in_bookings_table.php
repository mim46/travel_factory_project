<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update the payment_status enum to include 'paid' and 'partially_paid'
        DB::statement("ALTER TABLE bookings MODIFY COLUMN payment_status ENUM('pending', 'paid', 'partially_paid', 'completed', 'failed', 'cancelled') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE bookings MODIFY COLUMN payment_status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending'");
    }
};
