<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Http\Resources\ProductResource;

class ListProductQrController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q');
        $category = $request->input('category');
        $productsQuery = Products::with('category');

        if ($query) {
            $productsQuery->where('name', 'LIKE', "%{$query}%")
                ->orWhere('description', 'LIKE', "%{$query}%");
        }

        if ($category) {
            $productsQuery->whereHas('category', function ($q) use ($category) {
                $q->where('name', $category);
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
            'posts' => ProductResource::collection($products),
        ]);
    }

    public function favorites(Request $request)
    {
        $ids = $request->input('ids');
        if (!$ids) {
            return response()->json(['data' => []]);
        }

        $idArray = explode(',', $ids);
        $primaryKey = (new Products)->getKeyName();
        $cacheKey = 'favorites_' . implode('_', $idArray);

        $products = Cache::remember($cacheKey, 3600, function () use ($idArray, $primaryKey) {
            return Products::with('category')
                ->whereIn($primaryKey, $idArray)
                ->get();
        });

        return ProductResource::collection($products);
    }
}
