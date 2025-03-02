import React from "react";
import {Link, useNavigate} from "react-router-dom";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link
                    to="/"
                    className="text-xl font-bold">
                    Réseau Social
                </Link>
                <div className="flex space-x-4">
                    <Link
                        to="/"
                        className="hover:underline">
                        Accueil
                    </Link>
                    {token ? (
                        <>
                            <Link
                                to="/create-post"
                                className="hover:underline">
                                Créer un post
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="hover:underline">
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="hover:underline">
                                Connexion
                            </Link>
                            <Link
                                to="/register"
                                className="hover:underline">
                                Inscription
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
