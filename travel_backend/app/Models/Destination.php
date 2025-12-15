<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'country',
        'type',
        'description',
        'image',
        'is_popular',
        'is_featured',
    ];

    protected $casts = [
        'is_popular' => 'boolean',
        'is_featured' => 'boolean',
    ];
}
