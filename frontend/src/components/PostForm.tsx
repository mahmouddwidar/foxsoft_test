import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postsAPI } from "../services/api";
import { useFormik } from "formik";
import { postSchema } from "../utils/validationSchema";
import Loader from "./Loader";
import { useAuth } from "../contexts/AuthContext";

interface PostFormProps {
	mode: "create" | "edit";
}

const PostForm: React.FC<PostFormProps> = ({ mode }) => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const { userType } = useAuth();

	type PostFormValues = {
		title: string;
		content: string;
		status: "published" | "draft";
		user_id?: number;
	};

	const formik = useFormik({
		initialValues: {
			title: "",
			content: "",
			status: "draft" as "published" | "draft",
			user_id: undefined,
		},
		validationSchema: postSchema,
		onSubmit: handleSubmit,
	});

	async function handleSubmit(values: PostFormValues) {
		setError("");
		setIsLoading(true);

		try {
			if (mode === "create") {
				await postsAPI.createPost(values);
			} else {
				await postsAPI.updatePost(parseInt(id!), values);
			}
			navigate(-1);
		} catch (error: any) {
			setError(error.response?.data?.message || `Failed to ${mode} post`);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		// Fetch current user status
		const fetchInitialData = async () => {
			try {
				const response = await postsAPI.getCurrentUser();
				setIsAdmin(response.data.isAdmin);
			} catch (error) {
				console.error("Failed to fetch initial data:", error);
			}
		};

		fetchInitialData();
	}, []);

	useEffect(() => {
		if (mode === "edit" && id) {
			fetchPost();
		}
	}, [mode, id]);

	const fetchPost = async () => {
		try {
			setIsLoading(true);
			const response = await postsAPI.getPost(parseInt(id!));
			const post = response.data;
			formik.setValues({
				title: post.title,
				content: post.content,
				status: post.status,
				user_id: post.user?.id,
			});
		} catch (error: any) {
			setError(error.response?.data?.message || "Failed to fetch post");
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading && mode === "edit") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader />
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

						{error ? (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
								{error}
							</div>
						) : (
							<form onSubmit={formik.handleSubmit} className="space-y-6">
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
										name="title"
										disabled={isLoading}
										value={formik.values.title}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
										placeholder="Enter post title"
									/>
									{formik.errors.title && formik.touched.title && (
										<div className="text-red-600 text-sm mt-1">
											{formik.errors.title}
										</div>
									)}
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
										name="content"
										disabled={isLoading}
										value={formik.values.content}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										rows={8}
										className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
										placeholder="Enter post content"
									/>
									{formik.errors.content && formik.touched.content && (
										<div className="text-red-600 text-sm mt-1">
											{formik.errors.content}
										</div>
									)}
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
										name="status"
										disabled={isLoading}
										value={formik.values.status}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<option value="draft">Draft</option>
										<option value="published">Published</option>
									</select>
									{formik.errors.status && formik.touched.status && (
										<div className="text-red-600 text-sm mt-1">
											{formik.errors.status}
										</div>
									)}
								</div>

								{/* User ID field for admin users */}
								{userType === "admin" && (
									<div>
										<label
											htmlFor="user_id"
											className="block text-sm font-medium text-gray-700"
										>
											Assign to User ID
										</label>
										<input
											type="number"
											id="user_id"
											name="user_id"
											disabled={isLoading}
											value={formik.values.user_id || ""}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
											placeholder="Enter user ID"
										/>
										{formik.errors.user_id && formik.touched.user_id && (
											<div className="text-red-600 text-sm mt-1">
												{formik.errors.user_id}
											</div>
										)}
									</div>
								)}

								<div className="flex justify-end space-x-3">
									<button
										type="button"
										onClick={() => navigate(-1)}
										disabled={isLoading}
										className="bg-gray-300 cursor-pointer hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={isLoading || !(formik.isValid && formik.dirty)}
										className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
									>
										{isLoading
											? "Saving..."
											: mode === "create"
											? "Create Post"
											: "Update Post"}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostForm;
