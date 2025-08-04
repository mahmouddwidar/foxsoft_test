const Loader = () => {
	return (
		<div className="fixed inset-0 flex items-center justify-center">
			<div className="flex space-x-2">
				<div
					className="w-4 h-8 bg-blue-600 opacity-75 animate-bounce"
					style={{ animationDelay: "0.1s" }}
				/>
				<div
					className="w-4 h-8 bg-blue-600 opacity-75 animate-bounce"
					style={{ animationDelay: "0.2s" }}
				/>
				<div
					className="w-4 h-8 bg-blue-600 opacity-75 animate-bounce"
					style={{ animationDelay: "0.3s" }}
				/>
			</div>
		</div>
	);
};

export default Loader;
