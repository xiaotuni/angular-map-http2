// import Utility from "../../lib/Utility";


import { Utility, RedisService, DemoService } from '../../service';


const __PRE__ = '/demo'

export default (router) => {
  router
    .get(`${__PRE__}/test`, async (ctx) => {
      try {
        const key = 'tmp_1234';
        const hkey = 'hash_tmp_1234';
        const h1 = await RedisService.HSetValue(hkey, 'date', new Date().getTime());
        const h2 = await RedisService.HGetValue(hkey, 'date');

        const r1 = await RedisService.SetObject(key, { id: 1234, date: new Date(), ts: new Date().getTime() });
        const r2 = await RedisService.GetObject(key);

        const r3 = await RedisService.SetExpire(key, 1000);

        ctx.body = { msg: 'ok', r1, r2, r3, h1, h2 };
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .get(`${__PRE__}/delete/:key/:field`, async (ctx) => {
      try {
        const { query, params: { key, field } } = ctx;
        console.log(key, field);
        const r0 = await RedisService.GetObject(key);
        console.log(r0);
        delete r0[field];
        console.log(r0);
        await RedisService.SetObject(key, r0);
        const r2 = await RedisService.GetObject(key);
        console.log(r2);
        ctx.body = { r0, r2, msg: new Date() }

      } catch (ex) {
        console.log(ex.message);
        Utility.throwClientError(ctx, ex);
      }
    })
    .get(`${__PRE__}/grpc`, async (ctx) => {
      try {
        ctx.body = await DemoService.UserLogin({});
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
}