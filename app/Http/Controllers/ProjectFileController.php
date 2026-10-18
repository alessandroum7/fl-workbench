<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectFileRequest;
use App\Http\Requests\UpdateProjectFileRequest;
use App\Models\Project;
use App\Models\ProjectFile;
use Illuminate\Support\Facades\Gate;

class ProjectFileController extends Controller
{
    public function store(StoreProjectFileRequest $request, Project $project)
    {
        $file = $project->files()->create($request->validated());

        return back()->with('success', "Archivo {$file->name} creado.");
    }

    public function update(UpdateProjectFileRequest $request, ProjectFile $file)
    {
        $file->update($request->validated());

        return back()->with('success', 'Archivo guardado.');
    }

    public function destroy(ProjectFile $file)
    {
        Gate::authorize('update', $file->project);

        $file->delete();

        return back()->with('success', 'Archivo eliminado.');
    }
}