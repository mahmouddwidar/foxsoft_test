<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use App\Models\Admin;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;


class PostPolicy
{
    use HandlesAuthorization;

    public function view($user, Post $post)
    {
        if ($user instanceof Admin) {
            return true;
        }
        return $user instanceof User && ($user->isAdmin() || $post->user_id === $user->id);
    }

    public function update($user, Post $post)
    {
        if ($user instanceof Admin) {
            return true;
        }

        return $user instanceof User && $post->user_id === $user->id;
    }

    public function delete($user, Post $post)
    {
        if ($user instanceof Admin) {
            return true;
        }
        return $user instanceof User && ($user->isAdmin() || $post->user_id === $user->id);
    }
}
