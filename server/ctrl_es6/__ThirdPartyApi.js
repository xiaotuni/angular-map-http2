const httpClient = require('http');
const querystring = require('querystring');
const url = require('url');
const path = require('path');
const Utility = require('../lib/Utility');

class ThirdPartyApi {
  constructor(dbHelper) {
    this.DbAccess = dbHelper;
  }

  CallApi(args, Success, Error) {
    const { Rule, Options } = args;
    const { id, name, apiCall, isMergeOption } = Rule;
    const { Url, Method, ApiBodyParams, ApiHeaderParams } = apiCall;
    const urlInfo = url.parse(Url, true);
    const { hostname, path, port, protocol } = urlInfo;

    const _options = { host: hostname, port, path, method: Method, headers: {} };
    if (ApiHeaderParams) {
      ApiHeaderParams.forEach((hInfo) => {
        const { ParamName, ParamValue, IsFixedValue } = hInfo;
        if (ParamValue || ParamValue === false || ParamValue === 0) {
          _options.headers[ParamName] = IsFixedValue === true ? ParamValue : Options[ParamValue];
        }
      });
    }
    const postData = {};
    if (ApiBodyParams) {
      ApiBodyParams.forEach((bInfo) => {
        const { ParamName, ParamValue, IsFixedValue } = bInfo;
        if (ParamValue || ParamValue === false || ParamValue === 0) {
          postData[ParamName] = IsFixedValue === true ? ParamValue : Options[ParamValue];
        }
      });
    }
    _options.headers['Content-Type'] = 'application/json';
    const hClientRequest = httpClient.request(_options, (res) => {
      // res.setEncoding('utf8');
      let finalData = "";
      res.on("data", function (data) {
        finalData += data.toString();
      });

      res.on("end", function () {
        console.log(finalData);
        const _result = JSON.parse(finalData);
        Object.assign(Options, _result || {});
        Options.Result[id] = { __name: name, result: _result };
        Success && Success();
      });
    });
    const _m = Method.toLocaleLowerCase();
    const _methodList = ['get', 'delete']; // 请求的时候，不能写数据的。否则会报socket hand up错误。
    if (!_methodList.includes(_m)) { 
      hClientRequest.write(JSON.stringify(postData));
    }
    hClientRequest.on('error', (e) => {
      Error && Error(e);
    });
    hClientRequest.end();
  }
}

module.exports = ThirdPartyApi;