import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {typeDefs} from "./schema.js";
import {resolvers} from "./resolvers.js";
import db from "./datasources/db.js";
import {getUser} from "./auth.js";

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

async function startServer() {
    const {url} = await startStandaloneServer(server, {
        listen: {port: 4000},
        context: async ({req}) => {
            const authorization =
                req.headers.authorization?.split("Bearer ")?.[1];
            const user = authorization ? getUser(authorization) : null;
            return {
                dataSources: {
                    db,
                },
                user,
            };
        },
    });

    console.log(`🚀  Server ready at: ${url}`);
}

startServer().catch((err) => {
    console.error("Erreur lors du démarrage du serveur:", err);
    process.exit(1);
});
