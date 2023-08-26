<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class team_members extends Model
{
    use HasFactory;
    protected $table = 'team_members';
    protected $fillable  = [
        'team_id',
        'user_id'
    ];
}
