const http = require("http");
/**
 * 发送内容到界面上去.
 * @param data
 */
http.ServerResponse.prototype.Send = function (data) {
  this.write(JSON.stringify(data));
  this.end();
};


const webapi = require('./webapi');


module.exports = { webapi }