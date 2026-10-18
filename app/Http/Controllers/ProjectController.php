<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Gate;
class ProjectController extends Controller
{
    public function index(Request $request) {
        $projects = $request->user()->projects()
            ->where('type', 'personal')
            ->withCount('files')
            ->latest()
            ->get(['id', 'name', 'description', 'created_at']);
        return Inertia::render('projects/Index', [
            'projects' => $projects,
        ]);
    }
    public function create() {
        return Inertia::render('projects/Create');
    }
    public function store(StoreProjectRequest $request) {
        /*
        $request->user()->projects()->create([
            ...$request->validated(),
            'type' => 'personal', //lo fija el servidor, nunca viene del formulario
        ]);*/
        $project = DB::transaction(function () use ($request) {
            $project = $request->user()->projects()->create([
                ...$request->validated(),
                'type' => 'personal',
                'build_config' => [
                    'flex' => 'scanner.l',
                    'bison' => 'parser.y',
                    'link_flags' => [],
                ],
            ]);
            foreach(['scanner.l', 'parser.y', 'ejemplo.txt'] as $name) {
                $project->files()->create([
                    'name' => $name,
                    'content' => File::get(resource_path("project-stubs/{$name}")),
                ]);
            }
            return $project;
        });
        return redirect()
            ->route('projects.show', $project)
            ->with('success', 'Proyecto creado correctamente.');
    }
    public function show(Project $project) {
        Gate::authorize('view', $project);
        return Inertia::render('projects/Show', [
            'project' => $project->only(['id', 'name', 'description', 'build_config']),
            'files' => $project->files()->orderBy('name')->get(['id', 'name', 'content']),
        ]);
    }
}
