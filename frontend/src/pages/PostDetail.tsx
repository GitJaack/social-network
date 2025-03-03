import React, {useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useQuery, useMutation, gql} from "@apollo/client";

const GET_POST = gql`
    query GetPost($id: ID!) {
        post(id: $id) {
            id
            title
            content
            likesCount
            author {
                id
                username
            }
            comments {
                id
                content
                author {
                    id
                    username
                }
            }
        }
    }
`;

const UPDATE_POST = gql`
    mutation UpdatePost($id: ID!, $title: String!, $content: String!) {
        updatePost(id: $id, title: $title, content: $content) {
            success
            message
            post {
                id
                title
                content
            }
        }
    }
`;

const ADD_COMMENT = gql`
    mutation AddComment($postId: ID!, $content: String!) {
        addComment(postId: $postId, content: $content) {
            success
            message
            comment {
                id
                content
                author {
                    id
                    username
                }
            }
        }
    }
`;

const LIKE_POST = gql`
    mutation LikePost($postId: ID!) {
        likePost(postId: $postId) {
            success
            message
        }
    }
`;

const UNLIKE_POST = gql`
    mutation UnlikePost($postId: ID!) {
        unlikePost(postId: $postId) {
            success
            message
        }
    }
`;

const DELETE_POST = gql`
    mutation DeletePost($id: ID!) {
        deletePost(id: $id) {
            success
            message
        }
    }
`;

const PostDetail: React.FC = () => {
    const {id} = useParams<{id: string}>();
    const [commentContent, setCommentContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const {loading, error, data, refetch} = useQuery(GET_POST, {
        variables: {id},
        skip: !id,
    });

    const [addComment] = useMutation(ADD_COMMENT, {
        onCompleted: () => {
            setCommentContent("");
            refetch();
        },
    });

    const [likePost] = useMutation(LIKE_POST, {
        onCompleted: () => refetch(),
    });

    const [unlikePost] = useMutation(UNLIKE_POST, {
        onCompleted: () => refetch(),
    });

    const [deletePost] = useMutation(DELETE_POST, {
        onCompleted: () => {
            navigate("/");
        },
    });

    const [updatePost] = useMutation(UPDATE_POST, {
        onCompleted: () => {
            setIsEditing(false);
            refetch();
        },
    });

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            navigate("/login");
            return;
        }

        addComment({
            variables: {
                postId: id,
                content: commentContent,
            },
        });
    };

    const handleLike = () => {
        if (!token) {
            navigate("/login");
            return;
        }

        likePost({
            variables: {postId: id},
        }).catch((err) => {
            // Si l'utilisateur a déjà liké, on essaie d'unlike
            if (err.message.includes("déjà liké")) {
                unlikePost({
                    variables: {postId: id},
                });
            }
        });
    };

    const handleDelete = () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
            deletePost({
                variables: {id},
            });
        }
    };

    const handleEdit = () => {
        setEditTitle(post.title);
        setEditContent(post.content);
        setIsEditing(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updatePost({
            variables: {
                id,
                title: editTitle,
                content: editContent,
            },
        });
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur: {error.message}</p>;
    if (!data || !data.post) return <p>Post non trouvé</p>;

    const {post} = data;

    return (
        <div className="max-w-4xl mx-auto">
            {isEditing ? (
                <form
                    onSubmit={handleUpdate}
                    className="mb-6">
                    <div className="mb-4">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full p-2 border rounded text-3xl font-bold"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-2 border rounded"
                            rows={10}
                            required
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Sauvegarder
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                            Annuler
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                    <div className="text-gray-600 mb-6">
                        Par {post.author.username}
                        <div className="mt-2 flex space-x-2">
                            {post.author.id ===
                            localStorage.getItem("userId") ? (
                                <>
                                    <button
                                        onClick={handleEdit}
                                        className="text-blue-600 hover:text-blue-800">
                                        Modifier
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="text-red-600 hover:text-red-800">
                                        Supprimer
                                    </button>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    (Vous n'êtes pas l'auteur de ce post)
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}

            <div className="prose max-w-none mb-8">{post.content}</div>

            <div className="flex items-center mb-8">
                <button
                    onClick={handleLike}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-500">
                    <span>❤️</span>
                    <span>{post.likesCount}</span>
                </button>
            </div>

            <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">
                    Commentaires ({post.comments.length})
                </h2>

                {token && (
                    <form
                        onSubmit={handleAddComment}
                        className="mb-6">
                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            className="w-full p-3 border rounded"
                            rows={3}
                            placeholder="Ajouter un commentaire..."
                            required
                        />
                        <button
                            type="submit"
                            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Commenter
                        </button>
                    </form>
                )}

                <div className="space-y-4">
                    {post.comments.map((comment: any) => (
                        <div
                            key={comment.id}
                            className="border-b pb-4">
                            <div className="font-semibold">
                                {comment.author.username}
                            </div>

                            <p>{comment.content}</p>
                        </div>
                    ))}

                    {post.comments.length === 0 && (
                        <p className="text-gray-500">
                            Aucun commentaire pour le moment.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
