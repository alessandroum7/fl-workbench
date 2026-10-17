<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        $request->user()->projects()->create([
            ...$request->validated(),
            'type' => 'personal', //lo fija el servidor, nunca viene del formulario
        ]);
        return redirect()
            ->route('projects.index')
            ->with('success', 'Proyecto creado correctamente.');
    }
}
