<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiar la caché de permisos de Spatie antes de sembrar
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permisos = [
            'guardar proyectos',
            'gestionar proyectos de ejemplo',
            'gestionar plantillas',
            'publicar recursos',
            'listar usuarios',
            'gestionar usuarios',
        ];

        // Usamos firstOrCreate (nativo de Eloquent) pasando un array
        foreach ($permisos as $p) {
            Permission::firstOrCreate(['name' => $p, 'guard_name' => 'web']);
        }

        $rolEstudiante = Role::firstOrCreate(['name' => 'estudiante', 'guard_name' => 'web']);
        $rolEstudiante->syncPermissions(['guardar proyectos']);

        $rolDocente = Role::firstOrCreate(['name' => 'docente', 'guard_name' => 'web']);
        $rolDocente->syncPermissions([
            'guardar proyectos',
            'gestionar proyectos de ejemplo',
            'gestionar plantillas',
            'publicar recursos',
        ]);

        $rolAdmin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $rolAdmin->syncPermissions(Permission::all());
    }
}