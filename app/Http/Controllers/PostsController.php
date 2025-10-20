<?php

namespace App\Http\Controllers;

use App\Models\Posts;
use App\Models\Categories;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Posts\StorePostsRequest;

class PostsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Posts::with('category')->orderBy('title', 'asc')->get();
        $categories = Categories::orderBy('name', 'asc')->get();

        return inertia('posts', [
            'products' => ProductResource::collection($products),
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostsRequest $request)
    {
        $request->validated();

        $path = $request->file('image')->store('posts', 'public');

        Posts::create([
            'title'       => $request->title,
            'image'       => $path,
            'user_id'     => Auth::id(),
            'description' => $request->description,
            'category_id' => $request->category_id,
        ]);

        return to_route('posts.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StorePostsRequest $request, $id)
    {
        $posts = Posts::findOrFail($id);
        $request->validated();
        $path = $posts->image;

        if ($request->hasFile('image')) {
            if ($posts->image && Storage::disk('public')->exists($posts->image)) {
                Storage::disk('public')->delete($posts->image);
            }

            $path = $request->file('image')->store('posts', 'public');
        }

        $posts->update([
            'name'        => $request->title,
            'image'       => $path,
            'description' => $request->description,
            'category_id' => $request->category_id,
        ]);

        return to_route('posts.index');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Posts $posts)
    {
        if ($posts->image && Storage::disk('public')->exists($posts->image)) {
            Storage::disk('public')->delete($posts->image);
        }

        $posts->delete();

        return to_route('posts.index');
    }
}
