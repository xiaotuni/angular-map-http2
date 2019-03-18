import Utility from "../../lib/Utility";
import captcha from 'svg-captcha';

const __PRE__ = '/captcha';

export default (router) => {
  router
    .get(`${__PRE__}`, async (ctx) => {
      try {
        const cap = captcha.create({ fontSize: 50, width: 100 });
        if (ctx.session) {
          ctx.session.captcha = cap.text;
        } 
        ctx.append('value', Utility.ToMD5(cap.text));
        ctx.set('Content-Type', 'image/svg+xml');
        ctx.body = cap.data;
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
};