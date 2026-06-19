import express from "express";
import cors from "cors";
import routes from "./routes/routes";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

const app = express();
app.use(cors());
app.use(express.json());

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApollo = async () => {
  await apolloServer.start();
  app.use("/graphql", expressMiddleware(apolloServer));
  const port = process.env.PORT || 3001;
  console.log(`GraphQL endpoint ready at http://localhost:${port}/graphql`);
};

startApollo().catch((err) => {
  console.error("Failed to start Apollo Server:", err);
});

app.use("/api", routes);
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred.",
  });
});

export default app;
