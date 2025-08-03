import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { postsAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

interface Post {
	id: number;
	title: string;
	content: string;
	status: "published" | "draft";
	created_at: string;
	updated_at: string;
	user?: {
		id: number;
		name: string;
		email: string;
	};
}

const UserDashboard: React.FC = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		try {
			setIsLoading(true);
			const response = await postsAPI.getPosts();
			setPosts(response.posts || []);
		} catch (error: any) {
			setError(error.response?.data?.message || "Failed to fetch posts");
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = async () => {
		await logout();
		navigate("/users/login");
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-xl">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<h1 className="text-xl font-semibold text-gray-900">
								User Dashboard
							</h1>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-gray-700">Welcome, {user?.name}</span>
							<button
								onClick={handleLogout}
								className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</nav>

			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-gray-900">My Posts</h2>
						<button
							onClick={() => navigate("/posts/new")}
							className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
						>
							Create New Post
						</button>
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
							{error}
						</div>
					)}

					{posts.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-500 text-lg">
								No posts found. Create your first post!
							</p>
						</div>
					) : (
						<div className="bg-white shadow overflow-hidden sm:rounded-md">
							<ul className="divide-y divide-gray-200">
								{posts.map((post) => (
									<li key={post.id}>
										<div className="px-4 py-4 flex items-center justify-between">
											<div className="flex-1">
												<h3 className="text-lg font-medium text-gray-900">
													{post.title}
												</h3>
												<p className="text-sm text-gray-500 mt-1">
													Status:{" "}
													<span
														className={`capitalize ${
															post.status === "published"
																? "text-green-600"
																: "text-yellow-600"
														}`}
													>
														{post.status}
													</span>
												</p>
												<p className="text-sm text-gray-500 mt-1">
													Created:{" "}
													{new Date(post.created_at).toLocaleDateString()}
												</p>
											</div>
											<div className="flex space-x-2">
												<button
													onClick={() => navigate(`/posts/${post.id}/edit`)}
													className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
												>
													Edit
												</button>
												<button
													onClick={() => handleDeletePost(post.id)}
													className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
												>
													Delete
												</button>
											</div>
										</div>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	);

	async function handleDeletePost(postId: number) {
		if (window.confirm("Are you sure you want to delete this post?")) {
			try {
				await postsAPI.deletePost(postId);
				setPosts(posts.filter((post) => post.id !== postId));
			} catch (error: any) {
				setError(error.response?.data?.message || "Failed to delete post");
			}
		}
	}
};

export default UserDashboard;
