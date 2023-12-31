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


// these all will just return whatever is in the table... 
Route::get('roles', [roleController::class, 'roleNames']);

Route::get('userroles', [userRolesController::class, 'userRoles']);
Route::get('members', [teamMembersControllers::class, 'membersList']);
Route::get('credits', [userCreditHoursController::class, 'creditHours']);



Route::get('users', [userController::class, 'userslist']);
Route::post('signup', [userController::class, 'signup']);
Route::post('login', [userController::class, 'login']);
Route::post('updateProfile', [userController::class, 'updateProfile']);


Route::get('showTeams', [teamController::class, 'showTeams']);
Route::post('createTeam', [teamController::class, 'createTeam']);
Route::post('addUserToTeam', [teamController::class, 'addUserToTeam']);
Route::post('getUserTeams', [teamController::class, 'getUserTeams']);
Route::post('getMyTeams', [teamController::class, 'getMyTeams']);
Route::delete('deleteTeam', [teamController::class, 'deleteTeam']);
Route::delete('removeUserFromTeam', [teamController::class, 'removeUserFromTeam']);


Route::get('events', [eventController::class, 'eventList']);
Route::post('createEvent', [eventController::class, 'createEvent']);

Route::get('participants', [eventParticipantsController::class, 'participanstList']);
Route::post('addEventParticipant', [eventParticipantsController::class, 'addEventParticipant']);
Route::put('markAttendance', [eventParticipantsController::class, 'markAttendance']);
