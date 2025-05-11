const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const validationPath = path.join(__dirname, 'validation.proto');
const packageDefinition = protoLoader.loadSync(validationPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const validationProto = grpc.loadPackageDefinition(packageDefinition).validation;

const validationService = { 
  validate: (call, callback) => {
    const { framework, language , projectName } = call.request;
    if (!framework || !language || !projectName) {
      return callback(null, { isValid: false, details: 'Framework and language and ProjectName are required .' });
    }
    callback(null, { isValid: true, details: 'Validation passed' });
  }
};

const server = new grpc.Server();
server.addService(validationProto.ValidationService.service, validationService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`✅ gRPC ValidationService running on port ${port}`);
  server.start();
});
