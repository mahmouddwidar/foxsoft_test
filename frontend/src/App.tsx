import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";

import "./App.css";

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="font-inter">
					<Routes>
						{/* Public routes */}
						<Route path="/users/login" element={<UserLogin />} />
						<Route path="/admins/login" element={<AdminLogin />} />

						{/* Protected routes */}
						<Route
							path="/users"
							element={
								<ProtectedRoute requiredUserType="user">
									<UserDashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admins"
							element={
								<ProtectedRoute requiredUserType="admin">
									<AdminDashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/posts/new"
							element={
								<ProtectedRoute>
									<CreatePost />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/posts/:id/edit"
							element={
								<ProtectedRoute>
									<EditPost />
								</ProtectedRoute>
							}
						/>

						{/* Default redirect */}
						<Route path="/" element={<Navigate to="/users/login" replace />} />
						<Route path="*" element={<Navigate to="/users/login" replace />} />
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
