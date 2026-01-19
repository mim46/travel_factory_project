<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Query extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'message',
        'is_read',
        'admin_reply',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];
}
