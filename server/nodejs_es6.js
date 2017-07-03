const http = require('http');
const util = require('util');
const queryString = require('querystring');
const formidable = require('formidable');
const url = require('url');
const api = require('./ctrl_es6/index');

class server {
  constructor() { }

  createServer(port) {
    http.createServer((req, res) => {
      res.setHeader("Content-Type", "text/html;charset=utf-8");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("access-control-allow-headers", "x-pingother, origin, x-requested-with, content-type, accept");
      res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");

      const r = new routes(req, res);
      r.initHeader();
      r.parseUrlParams();
      r.parseFormDataInfo();
      r.processRequest();
    }).listen(port || 10000);
    console.log('http://127.0.0.1:%d', port || 10000)
  }
}

class routes {
  constructor(req, res) {
    this.res = res;
    this.req = req;
  }

  initHeader() {
    console.log('initHeader');
    this.res.setHeader("Content-Type", "application/json;charset=utf-8");
    this.res.setHeader("Access-Control-Allow-Origin", "*");
    this.res.setHeader("access-control-allow-headers", "x-pingother, origin, x-requested-with, content-type, accept, xiaotuni,systemdate");
    this.res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
    this.res.setHeader("Access-Control-Expose-Headers", "date, token,systemdate");
    this.res.setHeader('systemdate', new Date().getTime());
    const { method } = this.req;
    if (method && method === 'OPTIONS') {
      response.end();
      return;
    }
  }
  parseUrlParams() {
    console.log('parseUrlParams');

    // this.query = 
  }

  parseFormDataInfo() {
    console.log('parseFormDataInfo');
    new api.webapi(this.req, this.res).dept();
  }

  processRequest() {
    console.log('processRequest');
    // this.res.write(JSON.stringify({ code: 1, msg: 'ok', date: new Date().getTime() }));
    // this.res.end();
  }
}

const __s = new server();
__s.createServer();