<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class user_credit_hour extends Model
{
    use HasFactory;
    protected $table = 'user_credit_hours';
    protected $fillable = [
        'user_id',
        'event_id',
        'credit_hours',
        'team_id'
    ];
}
