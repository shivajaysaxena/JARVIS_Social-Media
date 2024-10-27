import { useState, useEffect } from "react";
import axios from "axios";
import { formatPostDate } from "../utils/dateFormat";

const Message = ({id}) => {
    const [suspiciousUserPosts, setSuspiciousUserPosts] = useState([]);

	const getSuspiciousUserPosts = async () => {
		try {
			const response = await axios.get(`/api/suspicious/posts/${id}`);
			setSuspiciousUserPosts(response.data);
			console.log(response.data);
		} catch (error) {
		console.error('Error fetching data:', error);
		}
	};
	
	useEffect(() => {
		getSuspiciousUserPosts();
	}, []);

	const messages = suspiciousUserPosts.suspiciousMessages;

  return (
    <div className="flex-1 px-4">
        {messages?.map((message) => (
        <div
            key={message._id}
            className='flex justify-end mb-4'
        >
            <div className='rounded-xl p-3 py-2 max-w-xs text-white bg-blue-500'>
                {message.text}
            </div>
            <span className="text-sm flex items-center text-right">{formatPostDate(message.createdAt)} {" "} ago</span>

            {message.img && (
            <div className="relative w-72">
                <img src={message.img} className='w-72 mx-auto h-72 object-contain rounded' />
            </div>
            )}
        </div>
        ))}
        {/* <div ref={messageEndRef} /> */}
    </div>
  )
}

export default Message