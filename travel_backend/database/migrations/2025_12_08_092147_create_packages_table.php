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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('title');                // Package Name
            $table->string('country');              // Country Name
            $table->string('city')->nullable();     // City (optional)
            $table->text('description');            // Package Details
            $table->string('image')->nullable();    // Image URL
            $table->decimal('price', 10, 2);        // Price (decimal)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
