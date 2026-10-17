<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            // Duenio del proyecto
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // puntero de origen para saber de que plantilla se copio
            $table->foreignId('source_project_id')->nullable()->constrained('projects')->nullOnDelete();

            // Nombre y descripcion del proyecto
            $table->string('name', 150);
            $table->text('description')->nullable();

            // uso del enum en lugar de multiples booleanos para evitar estados invalidos
            $table->enum('type', ['personal', 'example', 'template'])->default('personal');
            $table->unsignedTinyInteger('level')->nullable(); // 0 a 3, para los ejemplos
            $table->boolean('is_published')->default(false); // visible para estudiantes e invitados

            // Manifiesto de construcción declarativo
            $table->json('build_config')->nullable();       // flex, bison, flags_enlazado

            $table->timestamps();

            // indice para optimizar la busqueda en el catalogo
            $table->index(['type', 'is_published']);

            $table->unique(['user_id', 'name']); // un usuario no puede tener dos proyectos con el mismo nombre
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
