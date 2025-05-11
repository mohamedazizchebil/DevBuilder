const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { storeZip } = require('./storageService');

const PROTO_PATH = path.join(__dirname , 'storage.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const storageProto = grpc.loadPackageDefinition(packageDefinition).storage;

const server = new grpc.Server();

server.addService(storageProto.StorageService.service, { StoreZip: storeZip });

const PORT = 50054;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`📦 StorageService en écoute sur le port ${PORT}`);
  server.start();
});
