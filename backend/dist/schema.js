"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : {default: mod};
    };
Object.defineProperty(exports, "__esModule", {value: true});
exports.typeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.typeDefs = (0, graphql_tag_1.default)`
    type User {
        id: ID!
        username: String!
        posts: [Post!]!
        comments: [Comment!]!
        likes: [Like!]!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        author: User!
        comments: [Comment!]!
        likes: [Like!]!
        likesCount: Int!
        updatedAt: String
    }

    type PostResponse {
        code: Int!
        message: String!
        success: Boolean!
        post: Post
    }

    type DeleteResponse {
        code: Int!
        message: String!
        success: Boolean!
    }

    type Comment {
        id: ID!
        content: String!
        author: User!
        post: Post!
    }

    type CommentResponse {
        code: Int!
        message: String!
        success: Boolean!
        comment: Comment
    }

    type Like {
        id: ID!
        user: User!
        post: Post!
    }

    type LikePostResponse {
        success: Boolean!
        message: String!
    }

    type CreateUserResponse {
        code: Int!
        success: Boolean!
        message: String!
        user: User
    }

    type SignInUserResponse {
        code: Int!
        success: Boolean!
        message: String!
        token: String
    }

    type Query {
        users: [User!]!
        user(id: ID!): User
        posts: [Post!]!
        post(id: ID!): Post
        getComments(postId: String!): [Comment]!
        getLikesPost(postId: String!): Int!
    }

    type Mutation {
        createUser(username: String!, password: String!): CreateUserResponse
        signIn(username: String!, password: String!): SignInUserResponse
        createPost(title: String!, content: String!): PostResponse!
        updatePost(id: ID!, title: String!, content: String!): PostResponse!
        deletePost(id: ID!): DeleteResponse!
        addComment(postId: ID!, content: String!): CommentResponse!
        deleteComment(commentId: String!): CommentResponse
        likePost(postId: ID!): LikePostResponse!
        unlikePost(postId: ID!): LikePostResponse!
    }
`;
