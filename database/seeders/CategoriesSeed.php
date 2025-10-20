<?php

namespace Database\Seeders;

use App\Models\Categories;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriesSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'name' => 'Parfum Pria',
            ],
            [
                'name' => 'Parfum Wanita',
            ],
            [
                'name' => 'Parfum Unisex',
            ],
            [
                'name' => 'New',
            ],
            [
                'name' => 'Existing',
            ],
            [
                'name' => 'Best Seller',
            ],
        ];
        foreach ($data as $item) {
            Categories::create($item);
        }
    }
}
