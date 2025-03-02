import React, {useState} from "react";
import {useMutation, gql} from "@apollo/client";
import {useNavigate} from "react-router-dom";

const CREATE_USER = gql`
    mutation CreateUser($username: String!, $password: String!) {
        createUser(username: $username, password: $password) {
            code
            success
            message
            user {
                id
                username
            }
        }
    }
`;

const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [createUser, {loading}] = useMutation(CREATE_USER, {
        onCompleted: (data) => {
            if (data.createUser.success) {
                navigate("/login");
            } else {
                setError(data.createUser.message);
            }
        },
        onError: (error) => {
            setError(error.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        createUser({variables: {username, password}});
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Inscription</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form
                onSubmit={handleSubmit}
                className="space-y-4">
                <div>
                    <label className="block mb-1">Nom d'utilisateur</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">
                        Confirmer le mot de passe
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    {loading ? "Inscription en cours..." : "S'inscrire"}
                </button>
            </form>
        </div>
    );
};

export default Register;
