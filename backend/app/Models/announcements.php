<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class announcements extends Model
{
    use HasFactory;
    protected $table = 'announcements';
    protected $fillable = [
        'message',
        'team_id'
    ];
}
