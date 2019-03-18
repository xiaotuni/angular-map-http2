import { Utility, MSUserService } from "../../service";

const __PRE__ = '/msuser';

export default (router) => {
  router
    .get(`${__PRE__}`, async ctx => {
      const { session, sessionId, request: { body = {} } } = ctx;
      ctx.body = await MSUserService.process({ ...body, session, sessionId, method: 'get' });
    })
    .put(`${__PRE__}`, async ctx => {
      const { session, sessionId, request: { body = {} } } = ctx;
      ctx.body = await MSUserService.process({ ...body, session, sessionId, method: 'put' });
    })
    .delete(`${__PRE__}`, async ctx => {
      const { session, sessionId, request: { body = {} } } = ctx;
      ctx.body = await MSUserService.process({ ...body, session, sessionId, method: 'delete' });
    })
    .post(`${__PRE__}`, async ctx => {
      try {
        const { session, sessionId, request: { body = {} } } = ctx;
        const options = { session: { ...session }, sessionId, ...body };
        delete options.session.cookie;

        ctx.body = await MSUserService.process({ options, cmd: body.cmd, method: 'post' });
      } catch (ex) {
        console.log('-------error--------', ex.message);
        Utility.clientErrorInfo(ctx, ex);
      }
    });
}