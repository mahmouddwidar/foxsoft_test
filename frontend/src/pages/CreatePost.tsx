import React from "react";
import PostForm from "../components/PostForm";
import DashboardLayout from "../components/layouts/DashboardLayout";

const CreatePost: React.FC = () => {
	return (
		<>
			<DashboardLayout>
				<PostForm mode="create" />
			</DashboardLayout>
		</>
	);
};

export default CreatePost;
