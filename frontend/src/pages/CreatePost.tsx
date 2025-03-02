import React, {useState} from "react";
import {useMutation, gql} from "@apollo/client";
import {useNavigate} from "react-router-dom";

const CREATE_POST = gql`
    mutation CreatePost($title: String!, $content: String!) {
        createPost(title: $title, content: $content) {
            code
            success
            message
            post {
                id
            }
        }
    }
`;

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [createPost, {loading}] = useMutation(CREATE_POST, {
        onCompleted: (data) => {
            if (data.createPost.success) {
                navigate(`/post/${data.createPost.post.id}`);
            } else {
                setError(data.createPost.message);
            }
        },
        onError: (error) => {
            setError(error.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createPost({variables: {title, content}});
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Créer un nouvel article</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-4">
                <div>
                    <label className="block mb-1">Titre</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Contenu</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={10}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {loading ? "Publication en cours..." : "Publier"}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
