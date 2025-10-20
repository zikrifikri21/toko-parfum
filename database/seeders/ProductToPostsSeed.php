<?php

namespace Database\Seeders;

use App\Models\Posts;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ProductToPostsSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();

        try {
            $products   = DB::connection('tokosf')->table('product')->get();
            foreach ($products as $prod) {
                Posts::create([
                    'title'       => $prod->name,
                    'image'       => $prod->image,
                    'description' => $prod->description,
                    'user_id'     => 1,
                ]);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
