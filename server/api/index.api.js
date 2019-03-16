import compose from 'koa-compose';
import Router from 'koa-router';
import importDir from 'import-dir';

const prefix = '/xtn/api';

const routes = importDir('./router');

export default function api() {

  const router = new Router({ prefix });
  Object.keys(routes).forEach(name => routes[name](router));

  return compose([
    router.routes(),
    router.allowedMethods(),
  ]);
}
