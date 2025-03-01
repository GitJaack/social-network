"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const signIn_js_1 = require("./signIn.js");
const auth_js_1 = require("./auth.js");
const graphql_1 = require("graphql");
exports.resolvers = {
    Query: {
        posts: async (_, __, context) => {
            try {
                return await context.dataSources.db.post.findMany();
            }
            catch (e) {
                console.log(e);
                throw new graphql_1.GraphQLError("Erreur lors de la récupération des posts");
            }
        },
        post: async (_, { id }, context) => {
            const post = await context.dataSources.db.post.findUnique({
                where: { id },
                include: { comments: true, likes: true },
            });
            if (!post) {
                throw new graphql_1.GraphQLError("Article non trouvé");
            }
            return {
                ...post,
                likesCount: post.likesCount || 0,
            };
        },
        getComments: async (_, { postId }, context) => {
            return await context.dataSources.db.comment.findMany({
                where: { postId },
            });
        },
        getLikesPost: async (_, { postId }, context) => {
            const post = await context.dataSources.db.post.findUnique({
                where: { id: postId },
            });
            if (!post) {
                throw new graphql_1.GraphQLError("Article non trouvé");
            }
            return post.likesCount;
        },
    },
    Mutation: {
        createUser: async (_, { username, password }, context) => {
            try {
                const existingUser = await context.dataSources.db.user.findUnique({
                    where: { username },
                });
                if (existingUser) {
                    return {
                        code: 400,
                        message: "Nom d'utilisateur déjà pris",
                        success: false,
                        user: null,
                    };
                }
                const createdUser = await context.dataSources.db.user.create({
                    data: {
                        username,
                        password: await (0, auth_js_1.hashPassword)(password),
                    },
                });
                return {
                    code: 201,
                    message: "Utilisateur créé avec succès",
                    success: true,
                    user: {
                        id: createdUser.id,
                        username: createdUser.username,
                    },
                };
            }
            catch (error) {
                return {
                    code: 400,
                    message: "Une erreur s'est produite lors de la création de l'utilisateur",
                    success: false,
                    user: null,
                };
            }
        },
        signIn: signIn_js_1.signIn,
        createPost: async (_, { title, content }, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("Authentification requise");
            }
            try {
                const post = await context.dataSources.db.post.create({
                    data: {
                        title,
                        content,
                        authorId: context.user.id,
                    },
                });
                return {
                    code: 201,
                    message: "Article créé avec succès",
                    success: true,
                    post,
                };
            }
            catch (error) {
                return {
                    code: 400,
                    message: "Erreur lors de la création de l'article",
                    success: false,
                    post: null,
                };
            }
        },
        updatePost: async (_, { id, title, content }, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("Authentification requise");
            }
            const post = await context.dataSources.db.post.findUnique({
                where: { id },
            });
            if (!post) {
                throw new graphql_1.GraphQLError("Article non trouvé");
            }
            if (post.authorId !== context.user.id) {
                throw new graphql_1.GraphQLError("Action non autorisée");
            }
            const updatedPost = await context.dataSources.db.post.update({
                where: { id },
                data: { title, content },
            });
            return {
                code: 200,
                message: "Article mis à jour avec succès",
                success: true,
                post: updatedPost,
            };
        },
        deletePost: async (_, { id }, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("Authentification requise");
            }
            const post = await context.dataSources.db.post.findUnique({
                where: { id },
            });
            if (!post) {
                throw new graphql_1.GraphQLError("Article non trouvé");
            }
            if (post.authorId !== context.user.id) {
                throw new graphql_1.GraphQLError("Action non autorisée");
            }
            await context.dataSources.db.post.delete({
                where: { id },
            });
            return {
                code: 200,
                message: "Article supprimé avec succès",
                success: true,
            };
        },
        addComment: async (_, { postId, content }, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("Authentification requise");
            }
            const post = await context.dataSources.db.post.findUnique({
                where: { id: postId },
            });
            if (!post) {
                throw new graphql_1.GraphQLError("Article non trouvé");
            }
            const comment = await context.dataSources.db.comment.create({
                data: {
                    content,
                    postId,
                    authorId: context.user.id,
                },
            });
            const author = await context.dataSources.db.user.findUnique({
                where: { id: context.user.id },
            });
            return {
                code: 201,
                message: "Commentaire ajouté avec succès",
                success: true,
                comment: {
                    ...comment,
                    author,
                },
            };
        },
        deleteComment: async (_, { commentId }, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("Authentification requise");
            }
            const comment = await context.dataSources.db.comment.findUnique({
                where: { id: commentId },
            });
            if (!comment) {
                throw new graphql_1.GraphQLError("Commentaire non trouvé");
            }
            if (comment.authorId !== context.user.id) {
                throw new graphql_1.GraphQLError("Vous n'êtes pas autorisé à supprimer ce commentaire");
            }
            await context.dataSources.db.comment.delete({
                where: { id: commentId },
            });
            return {
                code: 201,
                message: "Commentaire supprimé avec succès",
                success: true,
                comment,
            };
        },
        likePost: async (_, { postId }, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("Authentification requise");
            }
            const post = await context.dataSources.db.post.findUnique({
                where: { id: postId },
            });
            if (!post) {
                throw new graphql_1.GraphQLError("Article non trouvé");
            }
            const existingLike = await context.dataSources.db.like.findUnique({
                where: {
                    userId_postId: {
                        userId: context.user.id,
                        postId,
                    },
                },
            });
            if (existingLike) {
                throw new graphql_1.GraphQLError("Vous avez déjà liké cet article");
            }
            await context.dataSources.db.like.create({
                data: {
                    postId,
                    userId: context.user.id,
                },
            });
            await context.dataSources.db.post.update({
                where: { id: postId },
                data: { likesCount: { increment: 1 } },
            });
            return {
                success: true,
                message: "Post liké avec succès",
            };
        },
        unlikePost: async (_, { postId }, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("Authentification requise");
            }
            const post = await context.dataSources.db.post.findUnique({
                where: { id: postId },
            });
            if (!post) {
                throw new graphql_1.GraphQLError("Article non trouvé");
            }
            const existingLike = await context.dataSources.db.like.findUnique({
                where: {
                    userId_postId: {
                        userId: context.user.id,
                        postId,
                    },
                },
            });
            if (!existingLike) {
                throw new graphql_1.GraphQLError("Vous n'avez pas liké cet article");
            }
            await context.dataSources.db.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
            await context.dataSources.db.post.update({
                where: { id: postId },
                data: { likesCount: { decrement: 1 } },
            });
            return {
                success: true,
                message: "Like retiré avec succès",
            };
        },
    },
    User: {
        comments: async (parent, _, context) => {
            return await context.dataSources.db.comment.findMany({
                where: { authorId: parent.id },
            });
        },
        posts: async (parent, _, context) => {
            return await context.dataSources.db.post.findMany({
                where: { authorId: parent.id },
            });
        },
    },
    Post: {
        author: async (parent, _, context) => {
            const user = await context.dataSources.db.user.findUnique({
                where: { id: parent.authorId },
            });
            return user || { id: "", username: "", password: "" };
        },
        comments: async (parent, _, context) => {
            return await context.dataSources.db.comment.findMany({
                where: { postId: parent.id },
            });
        },
        likes: async (parent, _, context) => {
            return await context.dataSources.db.like.findMany({
                where: { postId: parent.id },
            });
        },
    },
    Comment: {
        author: async (parent, _, context) => {
            const user = await context.dataSources.db.user.findUnique({
                where: { id: parent.authorId },
            });
            if (!user) {
                throw new graphql_1.GraphQLError("Auteur du commentaire non trouvé");
            }
            return {
                id: user.id,
                username: user.username,
                password: user.password, // Nécessaire pour le type, mais ne sera pas exposé
            };
        },
        post: async (parent, _, context) => {
            const post = await context.dataSources.db.post.findUnique({
                where: { id: parent.postId },
            });
            if (!post) {
                throw new graphql_1.GraphQLError("Article du commentaire non trouvé");
            }
            return post;
        },
    },
};
