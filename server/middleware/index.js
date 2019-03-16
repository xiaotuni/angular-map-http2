import compose from 'koa-compose';
import convert from 'koa-convert';
import helmet from 'koa-helmet';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';
import Utility from '../lib/Utility';

const DomainName = process.env.DOMAIN;

function setcookie(req, name, val, secret, options) {
  req.cookies.set(name, val, options);
}

function AccessToken(opt) {
  const option = { name: 'token', secret: '', ...opt, };

  return async (ctx, next) => {
    let accessToken = ctx.query.access_token;
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
      origin: (request) => {
        const origin = request.get('Origin');
        if (process.env.NODE_ENV !== 'production') {
          return origin;
        } else {
          if (origin && (
            origin.indexOf(DomainName) >= 0
            || (/(localhost)($|:[0-9]*$)/.test(origin))
            || (/(127\.0\.0\.1)($|:[0-9]*$)/.test(origin)))
          ) {
            return origin;
          }
          return 'http://127.0.0.1';
        }
      },
    })),
    convert(bodyParser()),
    AccessToken({ name: 'token', secret: Utility.secret })
  ]);
}