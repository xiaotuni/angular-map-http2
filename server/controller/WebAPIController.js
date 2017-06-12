/**
 * Created by liaohb on 15-10-27 上午11:13.
 * File name By BlogController.js
 */
var Comm = require("./../lib/commonMethod");

function newGuid() {
  var guid = "";
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
    if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
      guid += "-";
  }
  return guid;
}

var WebApi = {
  index: function (Request, Respone, Options) {
    //Options.Condition = {};
    Comm.Comm.Display(Request, Respone, Options);
  },

  GetValues: function (req, res, opt) {
    console.log('--------------123-----------');
    const result = [
      { id: 1, title: '标题', content: '哈哈~~~' },
      { id: 1, title: '标题', content: '哈哈~~~' },
      { id: 1, title: '标题', content: '哈哈~~~' },
      { id: 1, title: '标题', content: '哈哈~~~' },
    ];
    res.SendJSON(result);
  },
  depts: function (req, res, opt) {
    const result = [];
    const CurrentTime = new Date().getTime() - 100000;
    // console.log(opt);
    const { GET } = opt;
    const { pageIndex, pageSize } = GET;
    console.log(pageIndex, pageSize);
    const _index = Number(pageIndex) || 0;
    const _size = Number(pageSize) || 10;

    // console.log(_index, _size, _index * _size, (_index + 1) * _size);
    // console.log('----------------');
    for (var i = _index * _size; i < (_index + 1) * _size; i++) {
      result.push({
        Id: i,
        Guid: newGuid(),
        DateTime: CurrentTime + Math.round(Number(Math.random() * 10000))
      });
    }
    res.SendJSON(result);
  },
  saveUser: function (req, res, opt) {
    res.SendErrorMsg({ code: 401, msg: '111输入的信息错误了' });
  },
}

exports.WebApi = WebApi;