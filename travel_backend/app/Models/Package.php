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
        'tour_type',
        'min_persons',
        'max_persons',
        'booking_deadline_days',
        'advance_percentage',
        'available_dates',
        'country_id',
        'place_id',
    ];

    protected $casts = [
        'is_latest' => 'boolean',
        'is_recommended' => 'boolean',
        'is_featured' => 'boolean',
        'inclusions' => 'array',
        'exclusions' => 'array',
        'available_dates' => 'array',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function place()
    {
        return $this->belongsTo(Place::class);
    }

    /**
     * Get total booked persons for this package
     */
    public function getTotalBookedAttribute()
    {
        return $this->bookings()
            ->whereIn('status', ['pending', 'confirmed', 'pending_confirmation'])
            ->where('payment_status', '!=', 'cancelled')
            ->sum('persons');
    }

    /**
     * Get available seats
     */
    public function getAvailableSeatsAttribute()
    {
        if ($this->tour_type === 'individual' || !$this->max_persons) {
            return null;
        }
        return $this->max_persons - $this->total_booked;
    }

    /**
     * Check if tour is confirmed (minimum reached)
     */
    public function getIsConfirmedAttribute()
    {
        if ($this->tour_type === 'individual') {
            return true;
        }
        return $this->min_persons && $this->total_booked >= $this->min_persons;
    }
}
