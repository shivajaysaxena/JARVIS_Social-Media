import { useState, useEffect } from "react";
import Post from "./Post";
import axios from "axios";
import PostSkeleton from "../components/skeletons/PostSkeleton";

const Posts = ({id}) => {
	const [suspiciousUserPosts, setSuspiciousUserPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const getSuspiciousUserPosts = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(`/api/suspicious/posts/${id}`);
			setSuspiciousUserPosts(response.data);
			console.log(response.data);
			setIsLoading(false);
		} catch (error) {
		console.error('Error fetching data:', error);
		}
	};
	
	useEffect(() => {
		getSuspiciousUserPosts();
	}, []);

	const posts = suspiciousUserPosts.suspiciousPosts;
	const user = suspiciousUserPosts.user;

	return (
		<div className="mb-2">
			{(isLoading) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && (
				<p className='text-center my-4'>No posts found. Switch to other Tab 👀</p>
			)}
			{!isLoading && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} user={user} />
					))}
				</div>
			)}
		</div>
	);
};
export default Posts;