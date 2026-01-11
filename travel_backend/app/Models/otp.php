<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'otp',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Check if OTP is expired
     */
    public function isExpired()
    {
        return $this->expires_at < now();
    }

    /**
     * Verify OTP
     */
    public static function verifyOtp($email, $otp)
    {
        $otpRecord = self::where('email', $email)
            ->where('otp', $otp)
            ->first();

        if (!$otpRecord) {
            return false;
        }

        if ($otpRecord->isExpired()) {
            $otpRecord->delete();
            return false;
        }

        return true;
    }
}