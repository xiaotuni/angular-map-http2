/**
 * Created by liaohb on 15-10-9 上午10:10.
 * File name By server.js
 */

var http = require("http");
var util = require("util");
var Comm = require("./lib/commonMethod");
/**
 * 定义全局变量.
 */
global.Config = Comm.Comm.ReadConfig();

// function start(route) {
//   try {
//     var listenPort = process.env.PORT || global.Config.ListenPort || 80;
//     http.createServer(function (request, response) {
//       response.setHeader("Content-Type", "text/html;charset=utf-8");
//       response.setHeader("Access-Control-Allow-Origin", "*");
//       response.setHeader("access-control-allow-headers", "x-pingother, origin, x-requested-with, content-type, accept");
//       response.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");

//       // response.writeHead(200, { "Content-Type": "text/html;charset=utf-8", "Access-Control-Allow-Origin": "*" });
//       route(response, request);
//     }).listen(listenPort);
//     console.log("start http server :http://127.0.0.1:%d", listenPort);
//   } catch (e) {
//     console.log(util.inspect(e, true, 3, true));
//   }
// }
/**
 * 将方法公开可以让外面使用
 * @type {start}
 */
// exports.start = start;


const http2 = require('http2');
const path = require('path');
const fs = require('fs');
const options = {
  key: fs.readFileSync('./server/ca/www.other.org.key'), //读取key
  cert: fs.readFileSync('./server/ca/www.other.org.crt') //读取crt
};
function start(route) {
  try {
    const listenPort = process.env.PORT || global.Config.ListenPort || 80;
    http2.createServer(options, function (request, response) {
      response.setHeader("Content-Type", "text/html;charset=utf-8");
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.setHeader("access-control-allow-headers", "x-pingother, origin, x-requested-with, content-type, accept");
      response.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");

      route(response, request);
    }).listen(listenPort);
    console.log("start http server :https://127.0.0.1:%d", listenPort);
  } catch (e) {
    console.log(util.inspect(e, true, 3, true));
  }
}

exports.start = start;