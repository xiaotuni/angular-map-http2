const fs = require('fs');
const vCode = require('svg-captcha');
const Utility = require('../lib/Utility');

class ApiHelper {

  constructor() {

  }

  post_api(request, response, options) {
    response.SendOk();
  }


  put_api(request, response, options) {
    response.SendOk();
  }

  delete_api(request, response, options) {
    response.SendOk();
  }

  get_captcha(req, res, options) {
    const captcha = vCode.create({ fontSize: 50, width: 100 });
    const exp = new Date();
    const a = new Date(exp.getTime() + 1000 * 60 * 10);
    Utility.ConstItem.CaptchaInfo[captcha.text] = a;
    res.Send(captcha.data);
  }

  get_captchaCode(req, res, options) {
    const captcha = vCode.create({ fontSize: 50, width: 100, height: 40 });
    const exp = new Date();
    const date = new Date(exp.getTime() + 1000 * 60 * 10);
    // 其实可以将验证码进行MD5加密一下。
    Utility.ConstItem.CaptchaInfo[captcha.text.toLocaleLowerCase()] = date;
    res.SendImgSvg(captcha.data);
  }

  post_fileupload(req, res, options) {
    console.log('--------file upload--------');

    const __fileName = 'file_name_' + new Date().getTime() + '.png';
    const { data } = options;
    fs.appendFileSync('./public/image/' + __fileName, data, 'buffer');
    res.SendOk();
  }


  post_filesupload(req, res, options) {
    console.log('--------file list upload--------');

    const __fileName = 'file_name_' + new Date().getTime() + '.png';
    const { data } = options;
    fs.appendFileSync('./public/image/' + __fileName, data, 'buffer');
    res.SendOk();
  }

  get_async(req, res, options) {
    let aa = async () => {
      console.log('-------------0-------');
      const fun1 = await function () {
        return new Promise((resolve, reject) => {
          console.log('------1--func1------');
          resolve('哈哈');
        });
      };
      const fun2 = await function () {
        console.log('-----2--func2-----');
        return '方法2返回的值'
      }
      let result = fun1();
      console.log('----------下面是调用fun1 返回的数据-----');
      console.log(result);
      console.log('----------下面是调用fun2-----');
      let result1 = fun2();
      console.log('----------fun2 返回值为：---------', result1);
    }

    aa();

    res.Send({ code: 200, msg: 'async' });
  }
}

module.exports = ApiHelper;