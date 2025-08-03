import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { authAPI } from "../services/api";

interface User {
	id: number;
	name: string;
	email: string;
}

interface Admin {
	id: number;
	name: string;
	email: string;
}

interface AuthContextType {
	user: User | Admin | null;
	userType: "user" | "admin" | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (
		email: string,
		password: string,
		type: "user" | "admin"
	) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | Admin | null>(null);
	const [userType, setUserType] = useState<"user" | "admin" | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if user is already logged in on app load
		const token = localStorage.getItem("auth_token");
		const storedUserType = localStorage.getItem("user_type") as
			| "user"
			| "admin"
			| null;
		const storedUserData = localStorage.getItem("user_data");

		if (token && storedUserType && storedUserData) {
			try {
				const userData = JSON.parse(storedUserData);
				setUser(userData);
				setUserType(storedUserType);
			} catch (error) {
				console.error("Error parsing stored user data:", error);
				localStorage.removeItem("auth_token");
				localStorage.removeItem("user_type");
				localStorage.removeItem("user_data");
			}
		}
		setIsLoading(false);
	}, []);

	const login = async (
		email: string,
		password: string,
		type: "user" | "admin"
	) => {
		try {
			setIsLoading(true);
			let response;

			if (type === "user") {
				response = await authAPI.userLogin(email, password);
			} else {
				response = await authAPI.adminLogin(email, password);
			}

			const { token, user: userData, admin: adminData } = response;
			const userInfo = userData || adminData;

			// Store in localStorage
			localStorage.setItem("auth_token", token);
			localStorage.setItem("user_type", type);
			localStorage.setItem("user_data", JSON.stringify(userInfo));

			// Update state
			setUser(userInfo);
			setUserType(type);
		} catch (error: any) {
			console.error("Login error:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		try {
			await authAPI.logout();
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setUser(null);
			setUserType(null);
		}
	};

	const value: AuthContextType = {
		user,
		userType,
		isAuthenticated: !!user,
		isLoading,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
