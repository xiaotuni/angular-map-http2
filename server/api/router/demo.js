import Utility from "../../lib/Utility";

const __PRE__ = '/demo'

export default (router) => {
  router
    .get(`${__PRE__}/test`, async (ctx) => {
      try {
        ctx.body = { msg: 'ok' };
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .get('/abcdef', async (ctx) => {
      ctx.body = { msg: new Date() }
    })
}