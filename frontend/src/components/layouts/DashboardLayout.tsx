import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
	children,
}) => {
	const { user, userType, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate("/");
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Fixed Navigation */}
			<nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<Link to={`/${userType}s`} className="text-xl font-semibold text-gray-900">{`${userType === 'admin' ? 'Admin' : 'User'} Dashboard`}</Link>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-gray-700">Welcome, {user?.name}</span>
							<button
								onClick={handleLogout}
								className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="pt-16">{children}</main>
		</div>
	);
};

export default DashboardLayout;
