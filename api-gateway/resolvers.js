const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const validationPath = 'validation.proto';
const generationPath = 'generation.proto';

// Chargement des fichiers .proto
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

// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
  Mutation: {
    generateProject: (_, { framework, language, projectName }) => {
      const client = new validationProto.ValidationService('localhost:50051',
        grpc.credentials.createInsecure());

      return new Promise((resolve, reject) => {
        client.validate({ framework, language, projectName }, (err, response) => {
          if (err) {
            reject(err);
          } else if (!response.isValid) {
            reject(new Error('Invalid parameters'));
          } else {
            // Si la validation réussit, appeler le service de génération
            const generationClient = new generationProto.GenerationService('localhost:50052',
              grpc.credentials.createInsecure());

            generationClient.generateProject({ framework, language, projectName }, (genErr, genRes) => {
              if (genErr) {
                reject(genErr);
              } else {
                resolve({ message: genRes.message });
              }
            });
          }
        });
      });
    }
  }
};

module.exports = resolvers;
