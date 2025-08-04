import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Pages
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";

import "./App.css";
import Home from "./pages/Home";
import NotFound from "./components/NotFound";

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="font-inter">
					<Routes>
						{/* Public routes */}
						<Route
							path="/"
							element={
								<PublicRoute>
									<Home />
								</PublicRoute>
							}
						/>

						<Route
							path="/users/login"
							element={
								<PublicRoute>
									<UserLogin />
								</PublicRoute>
							}
						/>
						
						<Route
							path="/admins/login"
							element={
								<PublicRoute>
									<AdminLogin />
								</PublicRoute>
							}
						/>

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

						{/* Not Found */}
						<Route path="*" element={<NotFound />} />
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
