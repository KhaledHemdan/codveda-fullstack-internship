require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Ensure these paths match your files exactly
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // OBJECTIVE: This plugin forces the "Playground" UI to load instantly
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground()
    ],
    // OBJECTIVE: Handle Authentication in GraphQL
    context: ({ req }) => {
      const authHeader = req.headers.authorization || '';
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const user = jwt.verify(token, process.env.JWT_SECRET);
          return { user }; 
        } catch (err) {
          console.log("Auth: Invalid token");
        }
      }
      return {}; 
    }
  });

  await server.start();
  
  // Apply middleware to the /graphql path
  server.applyMiddleware({ app, path: '/graphql' });

  // Database Connection
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB Connected Successfully");
      app.listen(4000, () => {
        console.log(`🚀 GraphQL API ready at http://localhost:4000/graphql`);
      });
    })
    .catch(err => console.error("❌ DB Connection Error:", err.message));
}

startServer();