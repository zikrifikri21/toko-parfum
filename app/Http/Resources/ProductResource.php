<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->idproduct,
            'title' => $this->name,
            'price' => $this->price,
            'barcode' => $this->barcode,
            'image' => $this->image,
            'category' => $this->category ? $this->category->name : null,
            // 'category' => $this->whenLoaded('catergory', function ($category) {
            //     return $category->name;
            // }),
        ];
    }
}
