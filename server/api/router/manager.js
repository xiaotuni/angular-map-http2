import Utility from "../../lib/Utility";
import { ManagerService } from "../../service";

const __PRE__ = '/manager'

export default (router) => {
  router
    .get(`${__PRE__}/list`, async (ctx) => {
      try {
        ctx.body = await ManagerService.List(ctx.request.query);
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .get('/abcdef', async (ctx) => {
      ctx.body = { msg: new Date() }
    })
}