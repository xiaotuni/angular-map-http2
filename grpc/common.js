const grpc = require('grpc');
const pLoader = require('@grpc/proto-loader');
const grpcOptions = { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true };

export {
  grpc, pLoader, grpcOptions
}