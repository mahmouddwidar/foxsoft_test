<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PostController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $perPage = $request->query('per_page', 10);
        $searchTerm = $request->query('search');

        $query = Post::with('user')
            ->when(!$user->isAdmin(), fn($q) => $q->where('user_id', $user->id))
            ->when($searchTerm, function ($q) use ($searchTerm) {
                $q->where(function ($query) use ($searchTerm) {
                    $query->where('title', 'like', '%' . $searchTerm . '%')
                        ->orWhere('content', 'like', '%' . $searchTerm . '%');
                });
            })
            ->latest();

        $posts = $query->paginate($perPage);

        return PostResource::collection($posts)->response();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        $post = $request->user()->posts()->create($request->validated());

        return response()->json([
            'message' => 'Post created successfully',
            'post' => new PostResource($post->load('user'))
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Post $post): JsonResponse
    {
        $this->authorize('view', $post);

        return (new PostResource($post->load('user')))->response();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        $this->authorize('update', $post);

        $post->update($request->validated());

        return (new PostResource($post->load('user')))->response();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Post $post): JsonResponse
    {
        $this->authorize('delete', $post);

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }
}
