import http from 'http';
import util from 'util';
import queryString from 'querystring';
import formidable from 'formidable';
import url from 'url';

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
  }
}

class routes {
  constructor(req, res) {
    this.res = res;
    this.req = req;
  }

  initHeader() {
    response.setHeader("Content-Type", "application/json;charset=utf-8");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("access-control-allow-headers", "x-pingother, origin, x-requested-with, content-type, accept, xiaotuni,systemdate");
    response.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.setHeader("Access-Control-Expose-Headers", "date, token,systemdate");
    response.setHeader('systemdate', new Date().getTime());
    const { method } = request;
    if (method && method === 'OPTIONS') {
      response.end();
      return;
    }
  }
  parseUrlParams() {

    // this.query = 
  }

  parseFormDataInfo() {

  }

  processRequest() {

  }
}

const __s = new server();
__s.createServer();