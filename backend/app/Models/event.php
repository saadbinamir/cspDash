<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class event extends Model
{
    use HasFactory;
    protected $table = 'events';
    protected $fillable = [
        'title',
        'date',
        'organization_name',
        'location',
        'credit_hours',
        'coordinator_email',
        'team_id',
        'comments'
    ];
}
