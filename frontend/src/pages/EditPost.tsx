import React from "react";
import PostForm from "../components/PostForm";
import DashboardLayout from "../components/layouts/DashboardLayout";

const EditPost: React.FC = () => {
	return (
		<>
			<DashboardLayout>
				<PostForm mode="edit" />
			</DashboardLayout>
		</>
	);
};

export default EditPost;
