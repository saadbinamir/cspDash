<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class event_participant extends Model
{
    use HasFactory;

    protected $table = 'event_participants';
    protected $fillable = [
        'team_id',
        'event_id',
        'user_id',
        'attendance_status'
    ];
}
