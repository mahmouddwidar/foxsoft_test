import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postsAPI } from "../services/api";

interface PostFormProps {
	mode: "create" | "edit";
}

const PostForm: React.FC<PostFormProps> = ({ mode }) => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [status, setStatus] = useState<"published" | "draft">("draft");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (mode === "edit" && id) {
			fetchPost();
		}
	}, [mode, id]);

	const fetchPost = async () => {
		try {
			setIsLoading(true);
			const response = await postsAPI.getPost(parseInt(id!));
			const post = response.post;
			setTitle(post.title);
			setContent(post.content);
			setStatus(post.status);
		} catch (error: any) {
			setError(error.response?.data?.message || "Failed to fetch post");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const postData = { title, content, status };

			if (mode === "create") {
				await postsAPI.createPost(postData);
			} else {
				await postsAPI.updatePost(parseInt(id!), postData);
			}

			// Navigate back to dashboard
			navigate(-1);
		} catch (error: any) {
			setError(error.response?.data?.message || `Failed to ${mode} post`);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading && mode === "edit") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-xl">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white shadow sm:rounded-lg">
					<div className="px-4 py-5 sm:p-6">
						<h2 className="text-lg font-medium text-gray-900 mb-6">
							{mode === "create" ? "Create New Post" : "Edit Post"}
						</h2>

						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="title"
									className="block text-sm font-medium text-gray-700"
								>
									Title
								</label>
								<input
									type="text"
									id="title"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
									className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
									placeholder="Enter post title"
								/>
							</div>

							<div>
								<label
									htmlFor="content"
									className="block text-sm font-medium text-gray-700"
								>
									Content
								</label>
								<textarea
									id="content"
									value={content}
									onChange={(e) => setContent(e.target.value)}
									required
									rows={8}
									className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
									placeholder="Enter post content"
								/>
							</div>

							<div>
								<label
									htmlFor="status"
									className="block text-sm font-medium text-gray-700"
								>
									Status
								</label>
								<select
									id="status"
									value={status}
									onChange={(e) =>
										setStatus(e.target.value as "published" | "draft")
									}
									className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
								>
									<option value="draft">Draft</option>
									<option value="published">Published</option>
								</select>
							</div>

							<div className="flex justify-end space-x-3">
								<button
									type="button"
									onClick={() => navigate(-1)}
									className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isLoading}
									className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
								>
									{isLoading
										? "Saving..."
										: mode === "create"
										? "Create Post"
										: "Update Post"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostForm;
