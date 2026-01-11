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
        Schema::table('packages', function (Blueprint $table) {
            $table->enum('tour_type', ['group', 'individual'])->default('group')->after('package_type');
            $table->integer('min_persons')->nullable()->after('tour_type');
            $table->integer('max_persons')->nullable()->after('min_persons');
            $table->integer('booking_deadline_days')->nullable()->after('max_persons');
            $table->integer('advance_percentage')->default(30)->after('booking_deadline_days');
            $table->json('available_dates')->nullable()->after('advance_percentage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn([
                'tour_type',
                'min_persons',
                'max_persons',
                'booking_deadline_days',
                'advance_percentage',
                'available_dates'
            ]);
        });
    }
};
