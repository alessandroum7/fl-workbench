<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [ 'required', 'string', 'max:150',
                Rule::unique('projects', 'name')->where('user_id', $this->user()->id),
                ],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
    public function messages(): array {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'name.unique' => 'Ya tenés un proyecto con ese nombre.',
            'name.max' => 'El nombre no puede superar los 150 caracteres.',
            'name.regex' => 'El nombre solo puede contener letras, números, guiones bajos, guiones y puntos.',
        ];
    }
}
