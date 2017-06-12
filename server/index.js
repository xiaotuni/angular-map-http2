/**
 * Created by liaohb on 15-10-9 上午10:57.
 * File name By index.js
 * config.cfg
 *  {
 *      "ListenPort":8000,              //
 *      "DefaultPage":"Blog/index",     //默认访问页面。
 *      "AppCache":"false",             //是否开启缓存
 *      "HtmlTemplate":{"Blog/index":"aaaaa.html","Blog/add":"aaaa1.html",....} //生成的模板页面。
 *  }
 */
var server = require("./server");
var router = require("./router");


server.start(router.route);
