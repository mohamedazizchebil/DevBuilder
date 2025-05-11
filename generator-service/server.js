const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const generateProject = require('./generators/index.js');
const fs = require('fs');

// ----- Charger le fichier .proto de génération -----
const generationProtoPath = path.join(__dirname, 'generation.proto');
const generationPackageDef = protoLoader.loadSync(generationProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const generationProto = grpc.loadPackageDefinition(generationPackageDef).generation;

// ----- Charger le fichier .proto de zippage -----
const zipProtoPath = path.join(__dirname, 'zip.proto');
const zipPackageDef = protoLoader.loadSync(zipProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const zipProto = grpc.loadPackageDefinition(zipPackageDef).zip;

// ----- Charger le fichier .proto de stockage -----
const storageProtoPath = path.join(__dirname, 'storage.proto');
const storagePackageDef = protoLoader.loadSync(storageProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const storageProto = grpc.loadPackageDefinition(storagePackageDef).storage;

// ----- Clients gRPC -----
const zipClient = new zipProto.ZipService('localhost:50053', grpc.credentials.createInsecure());
const storageClient = new storageProto.StorageService('localhost:50054', grpc.credentials.createInsecure());

// ----- Implémentation du service GenerationService -----
const generationService = {
  generateProject: (call, callback) => {
    const { framework, language, projectName } = call.request;

    generateProject.generateProject({ framework, language, projectName })
      .then(() => {
        console.log('✅ Projet généré avec succès');

        const sourceDir = path.join(__dirname, '..', 'generated-projects', projectName);
        const outputZipPath = path.join(__dirname, '..', 'zips', `${projectName}.zip`);

        if (!fs.existsSync(sourceDir)) {
          return callback({
            code: grpc.status.NOT_FOUND,
            details: `Le répertoire source ${sourceDir} n'existe pas.`,
          });
        }

        zipClient.ZipDirectory({ sourceDir, outputZipPath }, (zipErr, zipRes) => {
          if (zipErr) {
            console.error('❌ Erreur de zippage :', zipErr);
            return callback({
              code: grpc.status.INTERNAL,
              details: 'Erreur lors du zippage du projet',
            });
          }

          console.log('📦 Projet zippé avec succès');

          // Lire le fichier .zip
          const zipData = fs.readFileSync(outputZipPath);

          // Appel au service de stockage
          storageClient.StoreZip({ fileName: `${projectName}.zip`, zipData }, (storageErr, storageRes) => {
            if (storageErr) {
              console.error('❌ Erreur stockage :', storageErr);
              return callback({
                code: grpc.status.INTERNAL,
                details: 'Erreur lors du stockage du projet',
              });
            }

            console.log('📂 Projet stocké avec succès');
            callback(null, {
              success: true,
              message: 'Projet généré, zippé et stocké avec succès',
              storagePath: storageRes.filePath,
            });
          });
        });
      })
      .catch((error) => {
        console.error('❌ Erreur génération projet :', error);
        callback({
          code: grpc.status.INTERNAL,
          details: 'Erreur lors de la génération du projet',
        });
      });
  }
};

// ----- Démarrer le serveur gRPC -----
const server = new grpc.Server();
server.addService(generationProto.GenerationService.service, generationService);

const PORT = 50052;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`🚀 GenerationService gRPC en écoute sur le port ${PORT}`);
  server.start();
});
