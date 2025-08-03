import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFormik, type FormikValues } from "formik";
import { loginSchema } from "../utils/validationSchema";

interface ApiError {
	response?: {
		data?: {
			message?: string;
		};
	};
}

interface LoginFormProps {
	userType: "user" | "admin";
}

const LoginForm: React.FC<LoginFormProps> = ({ userType }) => {
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { login } = useAuth();
	const navigate = useNavigate();

	async function handleSubmit(values: FormikValues) {
		setError("");
		setIsLoading(true);

		try {
			await login(values.email, values.password, userType);
			navigate(userType === "admin" ? "/admins" : "/users");
		} catch (error: unknown) {
			const apiError = error as ApiError;
			const errorMessage =
				apiError?.response?.data?.message || "Login failed. Please try again.";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: loginSchema,
		onSubmit: handleSubmit,
	});

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="">
					<h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
						{userType === "admin" ? "Admin Login" : "User Login"}
					</h2>
				</div>
				<form className="mt-8" onSubmit={formik.handleSubmit}>
					<div className="rounded-md -space-y-px">
						<div className="mb-2">
							<label htmlFor="email" className="sr-only">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="shadow-sm appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Email address"
								value={formik.values.email}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							{formik.errors.email && formik.touched.email && (
								<div className="p-2 pb-0 text-sm text-red-600">
									{formik.errors.email}
								</div>
							)}
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="shadow-sm appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Password"
								value={formik.values.password}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							{formik.errors.password && formik.touched.password && (
								<div className="p-2 pb-0 text-sm text-red-600">
									{formik.errors.password}
								</div>
							)}
						</div>
					</div>

					{error && (
						<div className="text-red-600 pt-2 text-sm text-center">{error}</div>
					)}

					<div className="mt-6">
						<button
							type="submit"
							disabled={isLoading || !(formik.isValid && formik.dirty)}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
						>
							{isLoading ? "Signing in..." : "Sign in"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
