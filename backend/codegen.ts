import {CodegenConfig} from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "./src/schema.ts",
    generates: {
        "./src/types.ts": {
            plugins: ["typescript", "typescript-resolvers"],
            config: {
                contextType: "./context#DataSourceContext",
                mappers: {
                    User: "./models#UserModel",
                    Post: "./models#PostModel",
                    Comment: "./models#CommentModel",
                    Like: "./models#LikeModel",
                },
            },
        },
    },
};

export default config;
