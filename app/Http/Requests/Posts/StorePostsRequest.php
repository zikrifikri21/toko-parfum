<?php

namespace App\Http\Requests\Posts;

use Illuminate\Foundation\Http\FormRequest;

class StorePostsRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'description' => 'nullable|string|max:1000',
            'category_id' => 'required_if:category,null|exists:categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Bidang judul harus diisi.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'File harus berupa jpeg, png, atau jpg.',
            'image.max' => 'File gambar tidak boleh lebih dari 2048 kilobyte.',
            'description.string' => 'Deskripsi harus berupa string.',
            'description.max' => 'Deskripsi tidak boleh lebih dari 1000 karakter.',
            'category_id.required' => 'Bidang kategori harus diisi.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
        ];
    }
}
