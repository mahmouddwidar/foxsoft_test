// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Pagination from "../components/Pagination";
import { postsAPI } from "../services/api";
import Loader from "../components/Loader";

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

interface ApiResponse {
	current_page: number;
	data: Post[];
	last_page: number;
	per_page: number;
	total: number;
}

const AdminDashboard: React.FC = () => {
	const navigate = useNavigate();
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [perPage, setPerPage] = useState(10);

	useEffect(() => {
		fetchPosts();
	}, [currentPage, perPage]);

	const fetchPosts = async () => {
		try {
			setIsLoading(true);
			const response = await postsAPI.getPosts({
				page: currentPage,
				per_page: perPage,
			});
			const data = response.data as ApiResponse;
			setPosts(data.data || []);
			setTotalPages(data.last_page);
			setTotalItems(data.total);
		} catch (error: any) {
			setError(error.response?.data?.message || "Failed to fetch posts");
		} finally {
			setIsLoading(false);
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setPerPage(Number(e.target.value));
		setCurrentPage(1);
	};

	return (
		<DashboardLayout>
			{isLoading ? (
				<div className="min-h-screen flex items-center justify-center">
					<Loader />
				</div>
			) : (
				<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
					<div className="px-4 py-6 sm:px-0">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-gray-900">All Posts</h2>
							<div className="flex items-center space-x-4">
								<div className="flex items-center">
									<label
										htmlFor="perPage"
										className="mr-2 text-sm text-gray-700"
									>
										Per page:
									</label>
									<select
										id="perPage"
										value={perPage}
										onChange={handlePerPageChange}
										className="border rounded-md px-2 py-1 text-sm"
									>
										<option value="5">5</option>
										<option value="10">10</option>
										<option value="20">20</option>
										<option value="50">50</option>
									</select>
								</div>
								<button
									onClick={() => navigate("/posts/new")}
									className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
								>
									Create New Post
								</button>
							</div>
						</div>

						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
								{error}
							</div>
						)}

						{posts.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-gray-500 text-lg">No posts found.</p>
							</div>
						) : (
							<>
								<div className="bg-white shadow overflow-hidden sm:rounded-md mb-4">
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
															Author: {post.user?.name || "Unknown"}
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

								<div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
									<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
										<div>
											<p className="text-sm text-gray-700">
												Showing{" "}
												<span className="font-medium">
													{(currentPage - 1) * perPage + 1}
												</span>{" "}
												to{" "}
												<span className="font-medium">
													{Math.min(currentPage * perPage, totalItems)}
												</span>{" "}
												of <span className="font-medium">{totalItems}</span>{" "}
												results
											</p>
										</div>
										<div>
											<Pagination
												currentPage={currentPage}
												totalCount={totalItems}
												pageSize={perPage}
												onPageChange={handlePageChange}
											/>
										</div>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</DashboardLayout>
	);

	async function handleDeletePost(postId: number) {
		if (window.confirm("Are you sure you want to delete this post?")) {
			try {
				await postsAPI.deletePost(postId);
				fetchPosts(); // Refresh the list after deletion
			} catch (error: any) {
				setError(error.response?.data?.message || "Failed to delete post");
			}
		}
	}
};

export default AdminDashboard;
