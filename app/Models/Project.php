<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'source_project_id',
        'name',
        'description',
        'type',
        'level',
        'is_published',
        'build_config',
    ];

    // Laravel convierte automaticamente estos tipos
    protected $casts = [
        'build_config' => 'array',
        'is_published' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sourceProject(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'source_project_id');
    }

    public function files(): HasMany
    {
        return $this->hasMany(ProjectFile::class);
    }
}
