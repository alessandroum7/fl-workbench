<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectFile extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFileFactory> */
    use HasFactory;

    protected $fillable = [
        'project_id',
        'name',
        'content',
    ];

    protected function content(): Attribute
    {
        return Attribute::make(get: fn (?string $value) => $value ?? '');
    }
    /** @return BelongsTo<Project, $this> */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
