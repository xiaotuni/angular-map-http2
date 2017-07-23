const Utility = require('../lib/commonMethod');
const Comm = Utility.Comm;
const Log = Utility.Log;

const queryFormat = function (query, values) {
  if (!values) return query;
  return query.replace(/\:(\w+)/g, function (txt, key) {
    if (values.hasOwnProperty(key)) {
      let _value = values[key];
      if (_value.constructor.name === 'Object') {
        _value = JSON.stringify(_value);
        const rValue = _value.replace(/'/g, "\\'").replace(/\"/g, '\\"');
        return rValue;
      }
      // return this.escape(_value);
      // 之所以不用上面那个，是因为用escape的时候会将内容进行转义。
      return _value;
    }
    return txt;
  }.bind(this));
};

class dealbusiness {
  constructor() {
    // this.DbHelper = DbHelper;
  }

  /**
   * 处理操作
   * 
   * @param {any} DbHelper 数据库访问类
   * @param {any} Request 请求
   * @param {any} Response 响应
   * @param {any} Options 参数选择信息
   * @memberof dealbusiness
   */
  Process(DbHelper, Request, Response, Options) {
    this.DbHelper = DbHelper;
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
        Response.SendError({ code: 404, msg: '【' + pathname + '】接口没有找到' });
      }
    }, (err) => {
      Response.SendError({ code: 404, msg: '【' + pathname + '】接口没有找到' });
    });
  }

  /**
   * 检查参数，规则里定义的要传的参数，与接口伟来的参数进行匹配检查。
   * 
   * @param {string} fields 字段
   * @param {object} params 参数对象
   * @returns 
   * @memberof dealbusiness
   */
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

  /**
   * 处理规则
   * 
   * @param {any} Request 请求
   * @param {any} Response 响应
   * @param {any} Options 参数选择信息
   * @param {any} RuleInfo 规则信息
   * @returns 
   * @memberof dealbusiness
   */
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
      // 组织结果
      const __Data = __self.__ResultInfo(result, success);
      Response.Send(__Data);
    }, (err) => {
      Response.SendError({ code: 500, msg: err });
    });
  }

  /**
   * 处理规则
   * 
   * @param {any} Rule 当前要处理的规则
   * @param {any} RuleCollection 剩余的规则集合 
   * @param {any} Options 参数
   * @param {any} Complete 处理完的回调
   * @param {any} Error 错误回调
   * @memberof dealbusiness
   */
  __Rules(Rule, RuleCollection, Options, Complete, Error) {
    const { id, type, sql, isRows, name, resultName, judgeinfo, isMergeOption } = Rule;
    const _t = (type || 'query').toLocaleLowerCase();
    const _FormatSQL = queryFormat(sql || '', Options);
    Log.Print('id序号 =>%d--执行的SQL语句【%s】', id, _FormatSQL);
    const __Next = (rList, rOption, rComplete, rError, err) => {
      if (err) {
        this.DbHelper.ClosePool(() => Error && Error(err), (pe) => {
          Log.Print('关闭连接池出错了-->', JSON.stringify(pe));
          Error && Error(err);
        });
        return;
      }
      const nR = rList.shift();
      if (nR) {
        this.__Rules(nR, rList, rOption, rComplete, rError);
      } else {
        this.DbHelper.ClosePool(() => Complete(Options), (pe) => {
          Log.Print('关闭连接池出错了-->', JSON.stringify(pe));
          Complete(Options);
        });
      }
    };
    const __self = this;
    switch (_t) {
      case 'begintran':
        this.DbHelper.BeginTransaction(() => __Next(RuleCollection, Options, Complete, Error), (error) => __Next(null, null, null, null, error));
        break;
      case 'commit':
        this.DbHelper.Commit(() => __Next(RuleCollection, Options, Complete, Error), (err) => __Next(null, null, null, null, err));
        break;
      case 'query':
        if (isRows) {
          this.DbHelper.Query(_FormatSQL, (data) => {
            const { result } = data;
            Options.Result[id] = { __name: name, result };
            __Next(RuleCollection, Options, Complete, Error);
          }, (err) => __Next(null, null, null, null, err));
        } else {
          this.DbHelper.QueryOne(_FormatSQL, (data) => {
            const { result } = data;
            if (!!isMergeOption) {
              // 将数据合并到Options里去。
              Object.assign(Options, result || {});
            } else {
              Options.Result[id] = { __name: name, result };
            }
            __Next(RuleCollection, Options, Complete, Error);
          }, (err) => __Next(null, null, null, null, err));
        }
        break;
      case 'insert':
        this.DbHelper.InsertSQL(_FormatSQL, (data) => {
          const { result } = data;
          if (name && name !== '') {
            const __InsertResultInfo = {};
            __InsertResultInfo[name] = result.insertId;
            Object.assign(Options, __InsertResultInfo);
          }
          __Next(RuleCollection, Options, Complete, Error);
        }, (err) => __Next(null, null, null, null, err));
        break;
      case 'delete':
        this.DbHelper.DeleteSQL(_FormatSQL,
          (data) => __Next(RuleCollection, Options, Complete, Error),
          (err) => __Next(null, null, null, null, err));
        break;
      case 'update':
        this.DbHelper.UpdateSQL(_FormatSQL,
          (data) => __Next(RuleCollection, Options, Complete, Error),
          (err) => __Next(null, null, null, null, err));
        break;
      case 'judge':

        const __JudgeOperator = (content) => {
          __self.__ProcessRuleJudge(judgeinfo, content,
            // 成功向下走。
            () => __Next(RuleCollection, content, Complete, Error),
            // 失败，执行中断。
            (err) => __Next(null, null, null, null, err),
            // 执行分支规则
            (chilrenRules) => __Next(chilrenRules, content, Complete, Error));
        };
        if (_FormatSQL) {
          this.DbHelper.QueryOne(_FormatSQL, (data) => {
            Object.assign(Options, data.result || {});
            __JudgeOperator(Options)
          }, (err) => __Next(null, null, null, null, err));
        } else {
          __JudgeOperator(Options);
        }
        break;
    }
  }

  /**
   * 结果信息
   * 
   * @param {any} ResultNo 第几个为真返回的内容
   * @param {any} Options 选项信息
   * @returns 
   * @memberof dealbusiness
   */
  __ResultInfo(ResultNo, Options) {
    const { Result } = Options;
    const __ResultNoInfo = Result[ResultNo];
    if (__ResultNoInfo) {
      const __Info = __ResultNoInfo.result || {};
      if (__Info) {
        delete __Info.__name;
      }
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

  /**
   * 处理规则判断。
   * 
   * @param {any} judgeinfo 判断条件信息
   * @param {any} content 要判断的数据
   * @param {any} Success 判断成功回调
   * @param {any} Error 判断失败回调
   * @returns 
   * @memberof dealbusiness
   */
  __ProcessRuleJudge(judgeinfo, content, Success, Error, exeChilrenRules) {
    // const { result } = data;
    const { strByEval, strByThis, chilrenRules, failMsg } = judgeinfo || {};

    let __ExecResult = true;
    if (strByEval && strByEval !== '') {
      const __newEval = queryFormat(strByEval || ' ', content);
      Log.Print('执行 Eval 条件:%s', __newEval);
      __ExecResult = eval(__newEval);
    } else if (strByThis && strByThis !== '') {
      Log.Print('执行 this 条件:%s', strByThis);
      __ExecResult = new Function(strByThis).apply(content);
    }
    Log.Print('执行结果为：', __ExecResult);
    if (!__ExecResult) { // 判断失败，执行失败的时候，规则集合.
      if (chilrenRules && chilrenRules.length > 0) {
        exeChilrenRules && exeChilrenRules(chilrenRules);
        return;
      }
      Error && Error({ msg: failMsg });
      return;
    }
    Success && Success();

  }
}

module.exports = dealbusiness;


