import path from 'path';
import { grpc, pLoader, grpcOptions } from '../common';
import { Utility } from '../../server/service';


try {

  const init = async () => {
    const ucentr_proto = path.join(__dirname, '../proto/ucenter.user.proto');
    const pDefinition = pLoader.loadSync(ucentr_proto, grpcOptions);
    const lpd = grpc.loadPackageDefinition(pDefinition);
    const { User } = lpd.xtn.ucenter;

    const server = new grpc.Server();
    server.addService(User.service,
      {
        UserLogin: (client, cb) => {
          const { request } = client;
          Utility.printLog('UserLogin Params:', request);
          const content = { result: true, data: [{ id: 1, value: '内容1' }, { id: 2, value: '内容2' }] };
          cb(null, { code: 200, msg: 'ok', body: JSON.stringify(content) });
        }
      }
    );
    const { PORT } = process.env;
    const ipAdd = `0.0.0.0:${PORT}`;
    server.bind(ipAdd, grpc.ServerCredentials.createInsecure());
    server.start();
    Utility.printLog('grpc 服务启动', ipAdd);
  };

  init();

} catch (ex) {
  Utility.printLog('出错了', ex.message);
}