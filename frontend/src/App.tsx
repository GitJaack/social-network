import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import {ApolloProvider} from "@apollo/client";
import {client} from "./apollo-client";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <Navbar />
                <div className="container mx-auto p-4">
                    <Routes>
                        <Route
                            path="/"
                            element={<Home />}
                        />
                        <Route
                            path="/login"
                            element={<Login />}
                        />
                        <Route
                            path="/register"
                            element={<Register />}
                        />
                        <Route
                            path="/post/:id"
                            element={<PostDetail />}
                        />
                        <Route
                            path="/create-post"
                            element={
                                <PrivateRoute>
                                    <CreatePost />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </ApolloProvider>
    );
}

export default App;
