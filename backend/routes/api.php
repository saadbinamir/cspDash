<?php

use App\Http\Controllers\Api\eventController;
use App\Http\Controllers\Api\eventParticipantsController;
use App\Http\Controllers\Api\roleController;
use App\Http\Controllers\Api\teamController;
use App\Http\Controllers\Api\teamMembersControllers;
use App\Http\Controllers\Api\userController;
use App\Http\Controllers\Api\userCreditHoursController;
use App\Http\Controllers\Api\userRolesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('roles', [roleController::class, 'roleNames']);
Route::get('teams', [teamController::class, 'teams']);
Route::get('users', [userController::class, 'userslist']);
Route::get('userroles', [userRolesController::class, 'userRoles']);
Route::get('members', [teamMembersControllers::class, 'membersList']);
Route::get('events', [eventController::class, 'eventList']);
Route::get('participants', [eventParticipantsController::class, 'participanstList']);
Route::get('credits', [userCreditHoursController::class, 'creditHours']);
