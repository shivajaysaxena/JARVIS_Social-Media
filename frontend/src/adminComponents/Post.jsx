import { formatPostDate } from "../utils/dateFormat";

const Post = ({ post, user }) => {
  const postOwner = user;

  const formattedDate = formatPostDate(post.createdAt);
  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div
          className="w-8 h-8 rounded-full overflow-hidden"
        >
          <div className="avatar -z-10">
            <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
          </div>
        </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <div className="font-bold">
            {postOwner.fullname}
          </div>
          <span className="text-gray-700 flex gap-1 text-sm">
            <div to={`/profile/${postOwner.username}`}>
              @{postOwner.username}
            </div>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
        </div>
        <div className="flex flex-col gap-3 overflow-hidden">
          <span className="flex justify-start">{post.text}</span>
          {post.img && (
            <img
              src={post.img}
              className="h-80 object-contain rounded-lg border border-gray-700"
              alt=""
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Post;
