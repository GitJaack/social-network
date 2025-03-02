import React from "react";
import {useQuery, gql} from "@apollo/client";
import {Link} from "react-router-dom";
import PostCard from "../components/PostCard";

const GET_POSTS = gql`
    query GetPosts {
        posts {
            id
            title
            content
            likesCount
            author {
                id
                username
            }
        }
    }
`;

interface Post {
    id: string;
    title: string;
    content: string;
    likesCount: number;
    author: {
        id: string;
        username: string;
    };
}

const Home: React.FC = () => {
    const {loading, error, data} = useQuery(GET_POSTS);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur: {error.message}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Publications récentes</h1>
            <div className="space-y-4">
                {data.posts.map((post: Post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
