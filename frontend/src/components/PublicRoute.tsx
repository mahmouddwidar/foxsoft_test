import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PublicRouteProps {
	children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
	const { isAuthenticated, userType, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-xl">Loading...</div>
			</div>
		);
	}

	if (isAuthenticated) {
		// Redirect to appropriate dashboard based on user type
		const dashboardPath = userType === "admin" ? "/admins" : "/users";
		return <Navigate to={dashboardPath} replace />;
	}

	return <>{children}</>;
};

export default PublicRoute;
