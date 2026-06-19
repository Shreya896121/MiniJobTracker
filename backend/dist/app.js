"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes/routes"));
const server_1 = require("@apollo/server");
const express5_1 = require("@as-integrations/express5");
const schema_1 = require("./graphql/schema");
const resolvers_1 = require("./graphql/resolvers");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());

const apolloServer = new server_1.ApolloServer({
    typeDefs: schema_1.typeDefs,
    resolvers: resolvers_1.resolvers,
});
const startApollo = async () => {
    await apolloServer.start();
    app.use("/graphql", (0, express5_1.expressMiddleware)(apolloServer));
    const port = process.env.PORT || 3001;
    console.log(`GraphQL endpoint ready at http://localhost:${port}/graphql`);
};
startApollo().catch((err) => {
    console.error("Failed to start Apollo Server:", err);
});

app.use("/api", routes_1.default);
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        message: "An unexpected error occurred.",
    });
});
exports.default = app;
