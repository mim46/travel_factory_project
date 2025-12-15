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
            $table->enum('package_type', ['domestic', 'international', 'budget'])->default('domestic')->after('description');
            $table->string('place')->nullable()->after('package_type'); // coxsbazar, bangkok, dubai
            $table->string('duration')->nullable()->after('place'); // "3 Days 2 Nights"
            $table->boolean('is_latest')->default(false)->after('duration');
            $table->boolean('is_recommended')->default(false)->after('is_latest');
            $table->boolean('is_featured')->default(false)->after('is_recommended');
            $table->text('itinerary')->nullable()->after('is_featured');
            $table->json('inclusions')->nullable()->after('itinerary');
            $table->json('exclusions')->nullable()->after('inclusions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn([
                'package_type',
                'place',
                'duration',
                'is_latest',
                'is_recommended',
                'is_featured',
                'itinerary',
                'inclusions',
                'exclusions'
            ]);
        });
    }
};
