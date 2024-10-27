import SuspiciousUser from '../models/suspiciousUser.js'
import Post from '../models/post.js';
import Message from '../models/message.js'; 

export const getSuspiciousUser = async (req, res) => {
    try {
        const user = await SuspiciousUser.find().populate("userId").populate({
            path: "posts",
        });
        if (!user) {
            return res.status(404).json({ message: 'No suspicious user found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in suspicious controller : ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getSuspiciousUserPosts = async (req, res) => {
    const { id: userId } = req.params;
    try {
        // Step 1: Find the SuspiciousUser document for the given userId
        const suspiciousUser = await SuspiciousUser.findOne({ userId })
            .populate('userId')     // Populate user details
            .populate('posts')
            .populate('messages');             // Populate post details

        // Check if suspiciousUser exists
        if (!suspiciousUser) {
            return res.status(404).json({ message: "No suspicious posts found for this user." });
        }

        // Step 2: Fetch the user's suspicious posts
        const posts = await Post.find({
            _id: { $in: suspiciousUser.posts },  // Filter posts in suspiciousUser's posts array
            userId: userId                        // Ensure the posts belong to the specified user
        }).sort({ createdAt: -1 });               // Sort by createdAt in descending order

        const messages = await Message.find({
            _id: { $in: suspiciousUser.messages },  // Filter posts in suspiciousUser's posts array
            sender: userId                        // Ensure the posts belong to the specified user
        }).sort({ createdAt: -1 });               // Sort by createdAt in descending order

        // Step 3: Return results, including user and suspicious posts
        return res.status(200).json({
            user: suspiciousUser.userId,  // User details
            suspiciousPosts: posts,        // Array of suspicious posts
            suspiciousMessages: messages,  // Array of suspicious messages
        });
     } catch (error) {
        res.status(404).json({ message: error.message });
    }
}