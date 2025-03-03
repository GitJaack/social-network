import React, {useState} from "react";
import {useMutation, gql} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const SIGN_IN = gql`
    mutation SignIn($username: String!, $password: String!) {
        signIn(username: $username, password: $password) {
            code
            success
            message
            token
        }
    }
`;

interface DecodedToken {
    id: string;
    username: string;
}

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [signIn, {loading}] = useMutation(SIGN_IN, {
        onCompleted: (data) => {
            if (data.signIn.success && data.signIn.token) {
                const token = data.signIn.token;
                try {
                    const decodedToken = jwtDecode<DecodedToken>(token);
                    localStorage.setItem("token", token);
                    localStorage.setItem("userId", decodedToken.id);
                    navigate("/");
                } catch (error) {
                    console.error("Erreur lors du décodage du token:", error);
                    setError("Erreur lors de la connexion");
                }
            } else {
                setError(data.signIn.message);
            }
        },
        onError: (error) => {
            console.error("Erreur de connexion:", error);
            setError(error.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        signIn({variables: {username, password}});
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Connexion</h1>
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
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    {loading ? "Connexion en cours..." : "Se connecter"}
                </button>
            </form>
        </div>
    );
};

export default Login;
