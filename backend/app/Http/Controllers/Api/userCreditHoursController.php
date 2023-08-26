<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\user_credit_hour;
use Illuminate\Http\Request;

class userCreditHoursController extends Controller
{
    public function creditHours()
    {
        $credithrs = user_credit_hour::all();

        if ($credithrs->count() > 0) {
            return response()->json([
                'status' => 200,
                'roles' => $credithrs
            ], 200);
        } else {
            return response()->json([
                'status' => 404,
                'roles' => 'No Records found'
            ], 404);
        }
    }
}
