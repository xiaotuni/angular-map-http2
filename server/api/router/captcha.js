import Utility from "../../lib/Utility";
import captcha from 'svg-captcha';

const __PRE__ = '/captcha'
export default (router) => {
  router
    .get(`${__PRE__}`, async (ctx) => {
      try {
        const cap = captcha.create({ fontSize: 50, width: 100 });
        ctx.set('Content-Type', 'image/svg+xml');
        // ctx.body = String(cap.data);
        Utility.printLog('captcha:', cap.text);;
        ctx.body = cap.data;
        ctx.append('value', Utility.ToMD5(cap.text));
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
};