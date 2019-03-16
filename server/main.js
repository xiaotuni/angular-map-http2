import http from 'http';
import Koa from 'koa';
import api from './api/index.api';
import Utility from './lib/Utility';
import middleware from './middleware';

const init = async () => {
  const port = process.env.PORT || 10000;
  const app = new Koa()
  app.keys = ['secret'];
  app.use(middleware());
  app.use(api());
  app.use(async ctx => {
    ctx.status = 404;
    ctx.body = { code: 404, msg: '未找到' };
  });
  app.context.onerror = function (err) {
    if (!err) {
      return;
    }
    Utility.printLog(err);
    const { message } = err || {};

    try {
      this.status = err.status || 500;
      this.body = { msg: message };
      this.res.end(JSON.stringify(this.body));
    } catch (ex) {
      Utility.printLog(ex);
    }
  }

  const serve = http
    .createServer(app.callback())
    .listen(port);

  Utility.printLog('服务器启动', `http://127.0.0.1:${port}`);

  process.on('SIGINT', () => {
    MgDBHelper.close();
    serve.close(() => {
      setTimeout(() => {
        process.exit(0);
      }, 300);
    });
  });

}

try {
  init();

  process.on('unhandledRejection', (reason, p) => {
    Utility.printLog(reason, p);
  });

} catch (ex) {
  Utility.printLog('');
}