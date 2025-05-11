const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

const projectRoutes = require('./routes'); // Tes routes REST
const typeDefs = require('./schema');      // Schéma GraphQL
const resolvers = require('./resolvers');  // Résolveurs GraphQL

const app = express();

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(cors());
  app.use(bodyParser.json());

  // ✅ Middleware GraphQL sur /graphql
  app.use('/graphql', expressMiddleware(server));

  // ✅ Routes REST sur /api/...
  app.use('/api', projectRoutes);

  // ✅ Lancer un seul serveur
  app.listen(3000, () => {
    console.log('🚀 API Gateway running:');
    console.log('- REST endpoint → http://localhost:3000/api/generate-project');
    console.log('- GraphQL endpoint → http://localhost:3000/graphql');
  });
}

startServer();
