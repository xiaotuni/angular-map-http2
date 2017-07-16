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
    const sql = Comm.format("select * from sys_rule t where t.status = 1 and t.PathName = '{0}' and t.Method = '{1}'",
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

  __CheckFields(fields, params) {
    if (fields === "") {
      return true;
    }
    let notExistsFields = [];
    fields.split(',').forEach((field) => {
      if (!params[field]) {
        notExistsFields.push(field);
      }
    });
    if (notExistsFields.length === 0) {
      return true;
    }
    this.__NotExistsFields = notExistsFields;
    return false;
  }

  __ProcessRule(Request, Response, Options, RuleInfo) {
    // 开始处理规则
    const { Content } = RuleInfo;
    const RuleContent = JSON.parse(Content);
    console.log(JSON.stringify(RuleContent));
    const { rules, fields, result } = RuleContent;
    const { data, params } = Options;
    const __CheckedParams = Object.assign({}, data, params);
    if (!this.__CheckFields(fields, __CheckedParams)) {
      Response.SendError({ code: 400, msg: '参数错误,少传[' + this.__NotExistsFields.join(',') + ' ]字段' });
      return;
    }

    const __first = rules.shift();
    const __self = this;
    this.__Rules(__first, rules, Object.assign({}, data, params, { Result: {} }), (success) => {
      const { Result } = success;
      // 组织结果
      const __Data = __self.__ResultInfo(result, success);
      Response.Send(__Data);
    }, (err) => {
      Response.SendError({ code: 500, msg: err });
    });
  }

  __Rules(Rule, RuleCollection, Options, Complete, Error) {
    const { id, type, sql, isRows, name, resultName } = Rule;
    console.log('id-->', id);
    const _t = (type || 'query').toLocaleLowerCase();
    const _FormatSQL = queryFormat(sql || ' ', Options);
    const _NextRule = RuleCollection.shift();
    const __Next = (err) => {
      if (err) {
        Error && Error(err);
        return;
      }
      if (_NextRule) {
        this.__Rules(_NextRule, RuleCollection, Options, Complete, Error);
      } else {
        Complete(Options);
      }
    };
    switch (_t) {
      case 'begintran':
        this.DbHelper.BeginTransaction(() => {
          __Next();
        }, (error) => {
          __Next(error);
        });
        break;
      case 'commit':
        this.DbHelper.Commit(() => {
          __Next();
        }, (err) => {
          __Next(error);
        });
        break;
      case 'query':
        if (isRows) {
          this.DbHelper.Query(_FormatSQL, (data) => {
            const { result } = data;
            Options.Result[id] = { __name: name, result };
            __Next();
          }, (err) => { __Next(err); });
        } else {
          this.DbHelper.QueryOne(_FormatSQL, (data) => {
            const { result } = data;
            Options.Result[id] = { __name: name, result };
            __Next();
          }, (err) => { __Next(err); });
        }
        break;
      case 'insert':
        this.DbHelper.InsertSQL(_FormatSQL, (data) => {
          const { result } = data;
          if (resultName && resultName !== '') {
            const __InsertResultInfo = {};
            __InsertResultInfo[resultName] = result.insertId;
            Object.assign(Options, __InsertResultInfo);
          }
          __Next();
        }, (err) => { __Next(err); });
        break;
      case 'delete':
        this.DbHelper.DeleteSQL(_FormatSQL, (data) => {
          __Next();
        }, (err) => { __Next(err); });
        break;
      case 'update':
        this.DbHelper.UpdateSQL(_FormatSQL, (data) => {
          __Next();
        }, (err) => { __Next(err); });
        break;
    }

  }

  __ResultInfo(ResultNo, Options) {
    const { Result } = Options;
    const __ResultNoInfo = Result[ResultNo];
    if (__ResultNoInfo) {
      const __Info = __ResultNoInfo.result;
      delete __Info.__name;
      delete Result[ResultNo];

      Object.values(Result).forEach((value) => {
        const { __name, result } = value;
        __Info[__name] = result;
      });

      return __Info;
    }
    const values = Object.values(Result);
    return values && values.length > 0 ? values[0] : { msg: 'ok' };
  }

}

module.exports = dealbusiness;