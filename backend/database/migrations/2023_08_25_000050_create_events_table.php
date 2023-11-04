<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100);
            $table->date('date');
            $table->string('organization_name', 100);
            $table->string('location', 255);
            $table->decimal('credit_hours', 5, 2);
            $table->string('coordinator_email', 100);
            $table->unsignedBigInteger('team_id');
            $table->text('comments');

            $table->foreign('team_id')->references('id')->on('teams');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
