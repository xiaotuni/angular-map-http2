import path from 'path';
import { grpc, pLoader, grpcOptions } from '../../grpc/common';
import Utility from '../lib/Utility';

const { NODE_GRPC_HOST, NODE_GRPC_PORT } = process.env;
const grpcService = `${NODE_GRPC_HOST}:${NODE_GRPC_PORT}`;

export default class DemoService {

  constructor() {
    this.__init();
  }

  __init() {
    if (!this.GrpcUcenter) {
      const ucentr_proto = path.join(__dirname, '../../grpc/proto/ucenter.user.proto');
      const pDefinition = pLoader.loadSync(ucentr_proto, grpcOptions);
      const lpd = grpc.loadPackageDefinition(pDefinition);
      const { User } = lpd.xtn.ucenter;

      this.GrpcUcenter = new User(grpcService, grpc.credentials.createInsecure());
      Utility.printLog('连接ucenter服务', grpcService);
    }
  }

  async UserLogin(args) {
    this.__init();

    return new Promise((resolve, reject) => {
      this.GrpcUcenter.UserLogin({}, (err, data) => {
        if (err) {
          reject(err);
        } else {
          data.body = JSON.parse(data.body);
          Utility.printLog('UserLogin---', data.body);
          resolve(data);
        }
      })
    });
  }
}