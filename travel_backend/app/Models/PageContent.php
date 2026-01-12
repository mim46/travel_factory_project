<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    use HasFactory;

    protected $fillable = ['page', 'key', 'value'];

    public static function getPageContent($page)
    {
        return self::where('page', $page)->pluck('value', 'key')->toArray();
    }

    public static function updatePageContent($page, $data)
    {
        foreach ($data as $key => $value) {
            self::updateOrCreate(
                ['page' => $page, 'key' => $key],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
        }
    }
}
