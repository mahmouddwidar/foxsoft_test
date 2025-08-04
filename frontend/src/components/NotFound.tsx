import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center text-2xl">
			Not Found
			<div className="flex flex-col items-center mt-4">
				<p className="text-gray-500 text-sm">
					Sorry, the page you are looking for does not exist.
				</p>
				<Link to="/" className="ml-4 text-blue-500 hover:underline">
					Go to Home
				</Link>
			</div>
		</div>
	);
}
