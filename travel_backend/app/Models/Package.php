<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'country',
        'city',
        'description',
        'image',
        'price',
        'package_type',
        'place',
        'duration',
        'is_latest',
        'is_recommended',
        'is_featured',
        'itinerary',
        'inclusions',
        'exclusions',
    ];

    protected $casts = [
        'is_latest' => 'boolean',
        'is_recommended' => 'boolean',
        'is_featured' => 'boolean',
        'inclusions' => 'array',
        'exclusions' => 'array',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
