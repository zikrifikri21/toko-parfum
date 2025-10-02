<?php

namespace App\Http\Controllers;

use App\Models\Posts;
use Illuminate\Http\Request;

class ListProductQrController extends Controller
{
    public function index(Request $request)
    {
        $posts = Posts::select('id', 'title', 'description', 'image')->paginate(6);

        if ($request->wantsJson()) {
            return response()->json($posts);
        }

        return inertia('list-product', [
            'posts' => $posts,
        ]);
    }
}
