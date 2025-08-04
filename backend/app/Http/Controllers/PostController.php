<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $perPage = $request->query('per_page', 10);
        $postsQuery = Post::with('user')->latest();
        $searchTerm = $request->query('search');


        // User can only see their own posts
        if (!($user instanceof Admin)) {
            $postsQuery->where('user_id', $user->id);
        }

        if ($searchTerm) {
            $postsQuery->where(function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('content', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        $posts = $postsQuery->paginate($perPage);

        if ($posts->isEmpty() && $posts->currentPage() > $posts->lastPage()) {
            return response()->json([
                'message' => 'No posts found on this page.',
                'data' => [],
            ], 404);
        }

        return response()->json($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:published,draft',
        ]);

        $user = $request->user();

        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'status' => $request->status,
            'user_id' => $user->id,
        ]);

        return response()->json([
            'message' => 'Post created successfully',
            'post' => $post->load('user')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();

        // Check if user can view this post
        if (!($user instanceof Admin || $post->user_id === $user->id)) {
            return response()->json([
                'message' => 'Access denied. You can only view your own posts.'
            ], 403);
        }

        return response()->json([
            'post' => $post->load('user')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'status' => ['required', 'in:published,draft'],
        ]);

        $user = $request->user();

        if (!($user instanceof Admin || $user->id === $post->user_id)) {
            return response()->json([
                'message' => 'Access denied. You can only update your own posts.'
            ], 403);
        }

        // Update the post with validated data
        $post->update($validated);

        return response()->json([
            'message' => 'Post updated successfully',
            'post' => $post->load('user')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();

        // Check if user can delete this post
        if (!($user instanceof Admin || $post->user_id === $user->id)) {
            return response()->json([
                'message' => 'Access denied. You can only delete your own posts.'
            ], 403);
        }

        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully'
        ]);
    }
}
