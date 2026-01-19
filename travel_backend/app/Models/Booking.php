<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'package_id',
        'name',
        'email',
        'phone',
        'persons',
        'travel_date',
        'special_request',
        'passport_number',
        'passport_expiry',
        'visa_status',
        'status',
        'total_price',
        'paid_amount',
        'payment_method',
        'payment_status',
        'transaction_id',
        'payment_details',
    ];

    protected $casts = [
        'travel_date' => 'date',
        'passport_expiry' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}
