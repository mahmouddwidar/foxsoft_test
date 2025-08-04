import PostsDashboard from "../components/PostsDashbard";
import { postsAPI } from "../services/api";

const UserDashboard: React.FC = () => {
	const handleDeletePost = async (postId: number) => {
		await postsAPI.deletePost(postId);
	};

	return (
		<PostsDashboard
			title="My Posts"
			onDeletePost={handleDeletePost}
		/>
	);
};

export default UserDashboard;
