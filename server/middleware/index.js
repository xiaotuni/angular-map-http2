import compose from 'koa-compose';
import convert from 'koa-convert';
import helmet from 'koa-helmet';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import redisStore from 'koa-redis';

import Utility from '../lib/Utility';
import Redis from '../common/redis';

const DomainName = process.env.DOMAIN;

function setcookie(req, name, val, secret, options) {
  req.cookies.set(name, val, options);
}

function AccessToken(opt) {
  const option = { name: 'token', secret: '', ...opt, };

  return async (ctx, next) => {
    let accessToken = ctx.query.token;
    const authorization = ctx.get('Authorization');
    if (!accessToken && !!authorization && authorization.indexOf('token') !== -1) {
      const tokenBeginIndex = authorization.indexOf('token');
      accessToken = authorization.substr(tokenBeginIndex + 6);
    }

    accessToken && Utility.printLog('token:', accessToken);
    if (accessToken) {
      ctx.sessionId = accessToken;
      setcookie(ctx, option.name, accessToken, option.secret, {});
    }
    await next();
  };
}

export default function middleware() {

  return compose([
    convert(helmet()),
    convert(cors({
      credentials: true,
      origin: (request) => {
        const origin = request.get('Origin');
        let _value = '';
        if (process.env.NODE_ENV !== 'production') {
          _value = origin;
        } else {
          if (origin && (
            origin.indexOf(DomainName) >= 0
            || (/(localhost)($|:[0-9]*$)/.test(origin))
            || (/(127\.0\.0\.1)($|:[0-9]*$)/.test(origin)))
          ) {
            _value = origin;
          } else {
            _value = 'http://127.0.0.1';
          }
        }
        return _value;
      },
    })),
    convert(bodyParser()),
    AccessToken({ name: 'token', secret: Utility.secret }),
    convert(session({ prefix: 'sid-', store: redisStore({ client: Redis.Client }) }))
  ]);
}