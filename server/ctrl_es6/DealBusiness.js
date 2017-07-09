const Utility = require('../lib/commonMethod');
const Comm = Utility.Comm;
const queryFormat = function (query, values) {
  if (!values) return query;
  return query.replace(/\:(\w+)/g, function (txt, key) {
    if (values.hasOwnProperty(key)) {
      return this.escape(values[key]);
    }
    return txt;
  }.bind(this));
};

class dealbusiness {
  constructor(DbHelper) {
    this.DbHelper = DbHelper;
  }

  Process(Request, Response, Options) {
    // Response.Send("ok");
    const { methodInfo } = Options;
    const { pathname, method } = methodInfo;
    const sql = Comm.format("select * from sys_rule t where t.PathName = '{0}' and t.Method = '{1}'",
      pathname, method);
    const __self = this;
    this.DbHelper.QueryOne(sql, (data) => {
      const { result } = data;
      if (result) {
        __self.__ProcessRule(Request, Response, Options, result);
      } else {
        Response.SendError({ code: 404, msg: '方法没有找到' });
      }
    }, (err) => {
      Response.SendError({ code: 404, msg: '方法没有找到' });
    });
  }

  __ProcessRule(Request, Response, Options, RuleInfo) {
    console.log(JSON.stringify(RuleInfo));
    // 开始处理规则
    const { Content } = RuleInfo;
    const RuleContent = JSON.parse(Content);
    const __first = RuleContent.shift();
    // Response.Send(RuleContent);
    const { data, params } = Options;
    this.__Rules(__first, RuleContent, Object.assign({}, data, params, { Result: {} }), (success) => {
      const { Result } = success;
      Response.Send(Result);
    });
  }

  __Rules(rule, RuleCollection, Options, Complete) {
    const { type, sql, isRows, name } = rule;
    const _t = (type || 'query').toLocaleLowerCase();
    const _FormatSQL = queryFormat(sql, Options);
    const _NextRule = RuleCollection.shift();
    switch (_t) {
      case 'query':
        if (isRows) {
          this.DbHelper.Query(_FormatSQL, (data) => {
            const { result } = data;
            Options.Result[name] = result;
            if (_NextRule) {
              this.__Rules(_NextRule, RuleCollection, Options, Complete);
            } else {
              Complete(Options);
            }
          }, () => { });
        } else {
          this.DbHelper.QueryOne(_FormatSQL, (data) => {
            const { result } = data;
            Options.Result[name] = result;
            if (_NextRule) {
              this.__Rules(_NextRule, RuleCollection, Options, Complete);
            } else {
              Complete(Options);
            }
          }, () => { });
        }
        break;
      case 'insert':
        break;
      case 'delete':
        break;
      case 'update':
        break;
    }

  }
}

module.exports = dealbusiness;