const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const validationPath = 'validation.proto';
const generationPath = 'generation.proto';
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');

// Créer une nouvelle application Express
const app = express();

// Créer une instance ApolloServer avec le schéma et les résolveurs importés
const server = new ApolloServer({ typeDefs, resolvers });

// Appliquer le middleware ApolloServer à l'application Express
server.start().then(() => {
  app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server)
  );
});

const validationProtoDefinition = protoLoader.loadSync(validationPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const generationProtoDefinition = protoLoader.loadSync(generationPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const validationProto = grpc.loadPackageDefinition(validationProtoDefinition).validation;
const generationProto = grpc.loadPackageDefinition(generationProtoDefinition).generation;

const client = new validationProto.ValidationService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

const generationClient = new generationProto.GenerationService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

const generateProject = (req, res) => {
  const { framework, language, projectName } = req.body;

  client.validate({ framework, language, projectName }, (error, response) => {
    if (error) {
      return res.status(500).json({ message: 'Validation failed', error: error.message });
    }

    if (!response.isValid) {
      return res.status(400).json({ message: 'Invalid parameters', details: response.details });
    }

    generationClient.generateProject({ framework, language, projectName }, async (genErr, genRes) => {
      if (genErr) {
        return res.status(500).json({ message: 'Generation failed', error: genErr.message });
      }

      res.status(200).json({ message: genRes.message });
    });
  });
};

module.exports = { generateProject };
