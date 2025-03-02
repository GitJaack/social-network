import React from "react";
import {Link} from "react-router-dom";

interface PostCardProps {
    post: {
        id: string;
        title: string;
        content: string;
        likesCount: number;
        author: {
            id: string;
            username: string;
        };
    };
}

const PostCard: React.FC<PostCardProps> = ({post}) => {
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <Link to={`/post/${post.id}`}>
                <h2 className="text-xl font-semibold">{post.title}</h2>
            </Link>
            <p className="text-gray-600 mt-2">
                {post.content.length > 150
                    ? `${post.content.substring(0, 150)}...`
                    : post.content}
            </p>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <div>Par {post.author.username}</div>
                <div>{post.likesCount} ❤️</div>
            </div>
        </div>
    );
};

export default PostCard;
