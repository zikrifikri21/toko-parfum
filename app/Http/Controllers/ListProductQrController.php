<?php

namespace App\Http\Controllers;

use App\Models\Posts;
use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Http\Resources\ProductResource;

class ListProductQrController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q');
        $category = $request->input('category');
        $productsQuery = Posts::with('category');
        $categories = Cache::remember('categories_list', 36000, function () {
            return Categories::all();
        });

        if ($query) {
            $productsQuery->where('title', 'LIKE', "%{$query}%")
                ->orWhere('description', 'LIKE', "%{$query}%");
        }

        if ($category) {
            $productsQuery->whereHas('category', function ($q) use ($category) {
                $q->where('title', $category);
            });
        }

        if (!$query && !$category) {
            $cacheKey = 'products_page_' . $request->get('page', 1);
            $products = Cache::remember($cacheKey, 3600, function () use ($productsQuery) {
                return $productsQuery->paginate(10);
            });
        } else {
            $products = $productsQuery->paginate(10);
        }

        if ($request->wantsJson()) {
            return ProductResource::collection($products)->response()->getData(true);
        }

        return inertia('list-product', [
            'categories' => $categories,
        ]);
    }

    public function favorites(Request $request)
    {
        $ids = $request->input('ids');
        if (!$ids) {
            return response()->json(['data' => []]);
        }

        $idArray = explode(',', $ids);
        $primaryKey = (new Posts)->getKeyName();
        $cacheKey = 'favorites_' . implode('_', $idArray);

        $products = Cache::remember($cacheKey, 3600, function () use ($idArray, $primaryKey) {
            return Posts::with('category')
                ->whereIn($primaryKey, $idArray)
                ->get();
        });

        return ProductResource::collection($products);
    }
}
