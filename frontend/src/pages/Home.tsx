import { Link } from "react-router-dom";
import LoginArrow from "../components/icons/LoginArrow";

const Home = () => {
	return (
		<section className="min-h-screen flex justify-center items-center">
			<div className="flex justify-center items-center gap-x-8 border-1 border-gray-300 rounded-lg p-30 shadow-lg">
				<Link
					to="/users/login"
					className="flex justify-between items-center gap-x-3 text-base font-bold text-blue-700 border-1 rounded px-5 py-3 border-gray-300 hover:border-blue-500 hover:shadow-sm transition duration-300"
				>
					User Login
					<LoginArrow className="size-4 fill-blue-700" />
				</Link>
				<Link
					to="/admins/login"
					className="flex justify-between items-center gap-x-3 text-base font-bold text-amber-600 border-1 rounded px-5 py-3 border-gray-300 hover:border-amber-600 hover:shadow-sm transition duration-300"
				>
					Admin Login
					<LoginArrow className="size-4 fill-amber-600" />
				</Link>
			</div>
		</section>
	);
};

export default Home;
