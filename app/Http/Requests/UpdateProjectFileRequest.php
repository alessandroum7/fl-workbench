<?php

namespace App\Http\Requests;

use App\Models\ProjectFile;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('file')->project);
    }

    public function rules(): array
    {
        $file = $this->route('file');

        return [
            'name' => [
                'sometimes', 'required', 'string', 'max:100',
                'regex:' . StoreProjectFileRequest::NAME_REGEX,
                Rule::unique('project_files', 'name')
                    ->where('project_id', $file->project_id)
                    ->ignore($file->id),
            ],
            'content' => ['nullable', 'string', 'max:' . ProjectFile::MAX_CONTENT_LENGTH],
        ];
    }

    public function messages(): array
    {
        return (new StoreProjectFileRequest())->messages();
    }
}