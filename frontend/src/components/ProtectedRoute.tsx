import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
	children: React.ReactNode;
	requiredUserType?: "user" | "admin";
	redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	requiredUserType,
	redirectTo,
}) => {
	const { isAuthenticated, userType, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-xl">Loading...</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to={redirectTo || "/users/login"} replace />;
	}

	if (requiredUserType && userType !== requiredUserType) {
		// Redirect to appropriate dashboard based on user type
		const dashboardPath = userType === "admin" ? "/admins" : "/users";
		return <Navigate to={dashboardPath} replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
