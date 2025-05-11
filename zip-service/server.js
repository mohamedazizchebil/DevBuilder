const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs-extra');
const archiver = require('archiver');

// Charger le fichier .proto
const protoPath = path.join(__dirname, 'zip.proto');
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const zipProto = grpc.loadPackageDefinition(packageDefinition).zip;

// Fonction pour zipper un dossier
function zipDirectory(sourceDir, outputZipPath, callback) {
  try {
    fs.ensureDirSync(path.dirname(outputZipPath));

    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      callback(null, { success: true, message: '✅ Zip completed successfully' });
    });

    archive.on('error', err => {
      console.error('❌ Archiving error:', err);
      callback(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  } catch (err) {
    console.error('❌ Error in zipDirectory:', err);
    callback(err);
  }
}

// Implémentation du service gRPC
const zipService = {
  ZipDirectory: (call, callback) => {
    const { sourceDir, outputZipPath } = call.request;

    if (!sourceDir || !outputZipPath) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'sourceDir and outputZipPath are required.',
      });
    }

    if (!fs.existsSync(sourceDir)) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: `Source directory "${sourceDir}" not found.`,
      });
    }

    zipDirectory(sourceDir, outputZipPath, (err, result) => {
      if (err) {
        return callback({
          code: grpc.status.INTERNAL,
          message: err.message || 'Unknown error during zip',
        });
      }
      callback(null, result);
    });
  },
};

// Démarrage du serveur gRPC
const server = new grpc.Server();
server.addService(zipProto.ZipService.service, zipService);

const PORT = 50053;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`🚀 ZipService gRPC en écoute sur le port ${PORT}`);
  server.start();
});
