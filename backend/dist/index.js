"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const schema_js_1 = require("./schema.js");
const resolvers_js_1 = require("./resolvers.js");
const db_js_1 = __importDefault(require("./datasources/db.js"));
const auth_js_1 = require("./auth.js");
const server = new server_1.ApolloServer({
    typeDefs: schema_js_1.typeDefs,
    resolvers: resolvers_js_1.resolvers,
});
async function startServer() {
    const { url } = await (0, standalone_1.startStandaloneServer)(server, {
        listen: { port: 4000 },
        context: async ({ req }) => {
            const authorization = req.headers.authorization?.split("Bearer ")?.[1];
            const user = authorization ? (0, auth_js_1.getUser)(authorization) : null;
            return {
                dataSources: {
                    db: db_js_1.default,
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
