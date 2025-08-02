<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return response()->json([
                'message' => 'Please log in to access this resource.',
                'error' => 'Unauthenticated'
            ], 401);
        }

        // Check if user is an admin
        if (!($request->user() instanceof \App\Models\Admin)) {
            return response()->json([
                'message' => 'Access denied. Admin role required.',
                'error' => 'Forbidden'
            ], 403);
        }

        return $next($request);
    }
}
