<?php

namespace App\Http\Requests;

use App\Models\Project;
use App\Models\ProjectFile;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreProjectFileRequest extends FormRequest
{
    public const NAME_REGEX = '/^[A-Za-z0-9_][A-Za-z0-9_.-]*\.(l|y|c|h|txt)$/i';

    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('project'));
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required', 'string', 'max:100',
                'regex:' . self::NAME_REGEX,
                Rule::unique('project_files', 'name')
                    ->where('project_id', $this->route('project')->id),
            ],
            'content' => ['nullable', 'string', 'max:' . ProjectFile::MAX_CONTENT_LENGTH],
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'Usá solo letras, números, "_", "-" y "."; sin carpetas, y extensión .l, .y, .c, .h o .txt.',
            'name.unique' => 'Ya existe un archivo con ese nombre en el proyecto.',
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($this->route('project')->files()->count() >= Project::MAX_FILES) {
                    $validator->errors()->add(
                        'name',
                        'El proyecto alcanzó el máximo de ' . Project::MAX_FILES . ' archivos.'
                    );
                }
            },
        ];
    }
}