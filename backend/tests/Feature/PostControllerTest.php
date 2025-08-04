<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Admin;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Admin $admin;
    private Post $post;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test users and post
        $this->user = User::factory()->create();
        $this->admin = Admin::factory()->create();
        $this->post = Post::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'Test Post',
            'content' => 'Test Content',
            'status' => 'published'
        ]);
    }

    public function test_user_can_view_their_own_posts()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/posts');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'content',
                        'status',
                        'created_at',
                        'updated_at',
                        'user' => [
                            'id',
                            'name',
                            'email',
                            'created_at',
                            'updated_at',
                            'email_verified_at',
                            'type'
                        ]
                    ]
                ],
                'meta',
                'links'
            ]);
    }

    public function test_user_can_update_their_own_post()
    {
        $updateData = [
            'title' => 'Updated Title',
            'content' => 'Updated Content',
            'status' => 'published'
        ];

        $response = $this->actingAs($this->user)
            ->putJson("/api/posts/{$this->post->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonPath('data.title', 'Updated Title');
    }

    public function test_user_cannot_update_others_post()
    {
        $otherUser = User::factory()->create();
        $otherPost = Post::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/posts/{$otherPost->id}", [
                'title' => 'Trying to Update',
                'content' => 'This should fail',
                'status' => 'published'
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_any_post()
    {
        $updateData = [
            'title' => 'Admin Updated',
            'content' => 'Admin Updated Content',
            'status' => 'published'
        ];

        $response = $this->actingAs($this->admin)
            ->putJson("/api/posts/{$this->post->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonPath('data.title', 'Admin Updated');
    }

    public function test_user_can_delete_their_own_post()
    {
        $response = $this->actingAs($this->user)
            ->deleteJson("/api/posts/{$this->post->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('posts', ['id' => $this->post->id]);
    }

    public function test_admin_can_delete_any_post()
    {
        $otherUser = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/posts/{$post->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    public function test_unauthorized_user_cannot_access_posts()
    {
        $response = $this->getJson('/api/posts');
        $response->assertStatus(401);
    }

    public function test_search_functionality()
    {
        Post::factory()->create([
            'title' => 'Searchable Post',
            'content' => 'This is a unique content',
            'user_id' => $this->user->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/posts?search=Searchable');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Searchable Post');
    }

    public function test_pagination()
    {
        // Create 15 posts
        Post::factory(15)->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/posts?per_page=10');

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data')
            ->assertJsonStructure([
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total'
                ]
            ]);

        // Check second page
        $response = $this->actingAs($this->user)
            ->getJson('/api/posts?page=2&per_page=10');

        $response->assertStatus(200)
            ->assertJsonPath('meta.current_page', 2);
    }
}
