// import Utility from "../../lib/Utility";

import { Utility, RedisService } from '../../service';

const __PRE__ = '/demo'

export default (router) => {
  router
    .get(`${__PRE__}/test`, async (ctx) => {
      try {
        const key = 'tmp_1234';
        const r1 = await RedisService.SetObject(key, { id: 1234, date: new Date() });
        const r2 = await RedisService.GetObject(key);

        const r3 = await RedisService.SetExpire(key, 1000);

        ctx.body = { msg: 'ok', r1, r2, r3 };
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .get('/abcdef', async (ctx) => {
      ctx.body = { msg: new Date() }
    })
}