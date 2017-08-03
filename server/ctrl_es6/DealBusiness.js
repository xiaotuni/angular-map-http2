const Utility = require('../lib/Utility');
const MySqlHelper = require('../ctrl_es6/DbHelper');
const Log = new Utility().Log;

const queryFormat = function (query, values) {
  if (!values) return query;
  return query.replace(/\:(\w+)/g, function (txt, key) {
    if (values.hasOwnProperty(key)) {
      let _value = values[key];
      if (_value && _value.constructor.name === 'Object') {
        _value = JSON.stringify(_value);
        // 将所有 ' 转为 \';  将所有 " 转为 \"; 
        let rValue = _value.replace(/'/g, "\\'").replace(/\"/g, '\\"');
        // 将所有换行\n 转为 \\n 要不能在保存 json的时候，会有问题。
        rValue = rValue.replace(/\\n/g, "\\\\n");
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
    // this.DbAccess = DbAccess;
  }

  /**
   * 处理操作
   * 
   * @param {any} DbAccess 数据库访问类
   * @param {any} Request 请求
   * @param {any} Response 响应
   * @param {any} Options 参数选择信息
   * @memberof dealbusiness
   */
  Process(DbAccess, Request, Response, Options) {
    this.DbAccess = DbAccess;
    const { methodInfo } = Options;
    const { pathname, method } = methodInfo;
    const sql = Utility.format("select * from sys_rule t where t.status = 1 and t.PathName = '{0}' and t.Method = '{1}'",
      pathname, method);
    Log.Print('查询接口SQL【 %s 】', sql);
    const __self = this;
    this.DbAccess.QueryOne(sql, (data) => {
      const { result } = data;
      if (result) {
        __self.__ProcessRule(Request, Response, Options, result);
      } else {
        Response.SendError({ code: 404, msg: '【' + pathname + '】接口没有找到' });
      }
    }, (err) => {
      let __msg = err;
      if (err) {
        if (err.message) {
          __msg = err.message;
        }
      } else {
        __msg = pathname;
      }
      Response.SendError({ code: 404, msg: '【' + __msg + '】接口没有找到' });
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
    if (!fields || fields === "") {
      return true;
    }
    let notExistsFields = [];
    fields.split(',').forEach((field) => {
      const __value = params[field];
      if (!__value && __value !== false && __value !== 0) {
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
    const { Content, Method, PathName } = RuleInfo;
    const RuleContent = JSON.parse(Content);
    const { rules, fields, result } = RuleContent;
    const { data, params } = Options;
    // 接口 token 判断
    if (!this.__ProcessApiTokenRight(RuleInfo, Options, Response)) {
      return;
    }
    const __CheckedParams = Object.assign({}, Options, data, params);
    // 查询参数
    if (!this.__CheckFields(fields, __CheckedParams)) {
      Response.SendError({ code: 400, msg: '参数错误,少传[' + this.__NotExistsFields.join(',') + ' ]字段' });
      return;
    }

    const __first = rules.shift();
    const __self = this;
    const __CurrentDate = new Date().getTime();
    Log.Print('--开始-->%s', new Date().Format("yyyy-MM-dd hh:mm:ss.S"));
    // 规则集合
    this.__Rules(__first, rules, Object.assign({}, __CheckedParams, { Result: {} }), (success) => {
      // 组织结果
      const { __ResultNo__ } = success;
      const __Data = __self.__ResultInfo(__ResultNo__ || result, success);
      Response.Send(__Data);
      Log.Print('--结束-->【%s】--用时:【%d】', new Date().Format("yyyy-MM-dd hh:mm:ss.S"),
        new Date().getTime() - __CurrentDate);
    }, (err) => {
      Log.Print('调用此接口出错:方法名称->【%s】,接口:【%s】', Method, PathName);
      Response.SendError({ code: 500, msg: err && err.message ? message : err });
      Log.Print('--结束-->【%s】--用时:【%d】', new Date().Format("yyyy-MM-dd hh:mm:ss.S"), new Date().getTime() - __CurrentDate);
    });
  }

  __ProcessApiTokenRight(RuleInfo, Options, Response) {
    const { IsTokenAccess, Method, PathName } = RuleInfo;
    const { token } = Options || {}
    const { __TokenCollection__ } = this.DbAccess;
    if (IsTokenAccess !== 1) {
      return true;
    }
    if (token && __TokenCollection__ && __TokenCollection__[token]) {
      const __tokenInfo = __TokenCollection__[token];
      Object.assign(Options, __tokenInfo || {});
      return true;
    }

    Log.Print('调用【%s】-->【%s】，需要Token', Method, PathName);
    Response.Send401('没有权限');
    return false;
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
    const { id, type, sql, isRows, name, resultName, judgeInfo, isMergeOption } = Rule;
    const _t = (type || 'query').toLocaleLowerCase();
    const _FormatSQL = queryFormat(sql || '', Options);
    if (_FormatSQL) {
      Log.Print('id序号 =>【%d】--执行的SQL语句【%s】', id, _FormatSQL);
    }
    /**
     * 处理下一条规则
     */
    const __Next = (rList, rOption, rComplete, rError, errInfo) => {
      if (errInfo) {
        Log.Print('执行此规则出错了:【%s】', JSON.stringify(Rule));
        this.DbAccess.ClosePool(() => rError && rError(errInfo && errInfo.message ? errInfo.message : errInfo), (pe) => {
          Log.Print('关闭连接池出错了-->', JSON.stringify(pe));
          rError && rError(errInfo && errInfo.message ? err.message : errInfo);
        });
        return;
      }
      const nR = rList.shift();
      if (nR) {
        const __self = this;
        __self.__Rules(nR, rList, rOption, rComplete, rError);
      } else {
        this.DbAccess.ClosePool(() => rComplete(rOption), (pe) => {
          Log.Print('关闭连接池出错了-->', JSON.stringify(pe));
          rComplete(rOption);
        });
      }
    };
    const __self = this;
    switch (_t) {
      case 'begintran':  // 事务
        this.DbAccess.BeginTransaction(() => __Next(RuleCollection, Options, Complete, Error), (error) => __Next(null, null, Error, null, error));
        break;
      case 'commit':     // 提交事务
        this.DbAccess.Commit(() => __Next(RuleCollection, Options, Complete, Error), (err) => __Next(null, null, null, Error, err));
        break;
      case 'query':      // 查询
        if (isRows) {         // 返回多行
          this.DbAccess.Query(_FormatSQL, (data) => {
            const { result } = data;
            Options.Result[id] = { __name: name, result };
            __Next(RuleCollection, Options, Complete, Error);
          }, (err) => __Next(null, null, null, null, err));
        } else {            // 返回单选
          this.DbAccess.QueryOne(_FormatSQL, (data) => {
            const { result } = data;
            // 将数据合并到Options里去。
            if (!!isMergeOption) {
              Object.assign(Options, result || {});
            }
            Options.Result[id] = { __name: name, result };
            __Next(RuleCollection, Options, Complete, Error);
          }, (err) => __Next(null, null, null, null, err));
        }
        break;
      case 'insert':        // 插入
        this.DbAccess.InsertSQL(_FormatSQL, (data) => {
          const { result } = data;
          let __name = (name && name !== '') ? name : 'InsertNo';
          const __InsertResultInfo = {};
          __InsertResultInfo[__name] = result.insertId;
          Object.assign(Options, __InsertResultInfo);
          __Next(RuleCollection, Options, Complete, Error);
        }, (err) => __Next(null, null, null, Error, err));
        break;
      case 'delete':       // 删除
        this.DbAccess.DeleteSQL(_FormatSQL,
          (data) => __Next(RuleCollection, Options, Complete, Error),
          (err) => __Next(null, null, null, Error, err));
        break;
      case 'update':      // 更新
        this.DbAccess.UpdateSQL(_FormatSQL,
          (data) => __Next(RuleCollection, Options, Complete, Error),
          (err) => __Next(null, null, null, Error, err));
        break;
      case 'judge':       // 判断
        const __JudgeOperator = (content, jInfo) => {
          __self.__ProcessRuleJudge(jInfo, content,
            // 成功向下走。
            () => __Next(RuleCollection, content, Complete, Error),
            // 失败，执行中断。
            (err) => __Next(null, null, null, Error, err),
            // 执行分支规则
            (chilrenRules) => {
              content.__ResultNo__ = jInfo.resultIndex;
              __Next(chilrenRules, content, Complete, Error);
            });
        };
        if (_FormatSQL) {
          this.DbAccess.QueryOne(_FormatSQL, (data) => {
            Object.assign(Options, data.result || {});
            __JudgeOperator(Options, judgeInfo)
          }, (err) => __Next(null, null, null, null, err));
        } else {
          __JudgeOperator(Options, judgeInfo);
        }
        break;
      case 'cache':
        const { cacheInfo } = Rule;
        this.__ProcessRuleCache(cacheInfo, Options, () => __Next(RuleCollection, Options, Complete, Error, null), (err) => __Next(null, null, null, Error, err))
        break;
      case 'setvalue':
        const { setValues } = Rule;
        this.__ProcessSetValue(Options, setValues);
        __Next(RuleCollection, Options, Complete, Error, null);
        break;
      default:
        __Next(RuleCollection, Options, Complete, Error, null);
        break;
    }
  }

  __ProcessSetValue(Options, setValues) {
    if (setValues) {
      setValues.forEach((item) => {
        const { fieldName, setValue } = item;
        if (setValue) {
          const __newEval = queryFormat(setValue, Options);
          const __ExecResult = eval(__newEval);
          Options[fieldName] = __ExecResult;
          Log.Print('执行 Eval 条件:%s--->新值为：%s', __newEval, __ExecResult);
        }
      });
    }
  }

  /**
   * 这里以后可以用将数据保存到redis里面去，现在就保存当前内存中就可以
   * 
   * @param {any} cacheInfo 
   * @param {any} content 
   * @param {any} Success 
   * @param {any} Error 
   * @memberof dealbusiness
   */
  __ProcessRuleCache(cacheInfo, content, Success, Error) {
    try {
      const { token, fields } = cacheInfo;
      const __cache = {};
      if (token) {
        __cache.token = content[token];
      }
      if (fields) {
        fields.split(',').forEach((field) => {
          const __key = Utility.$trim(field);
          __cache[__key] = content[__key];
        });
      }
      const { __TokenCollection__ } = this.DbAccess;
      if (__TokenCollection__) {
        __TokenCollection__[__cache.token] = __cache;
      }
      Success && Success();
    } catch (ex) {
      Error && Error(ex.message);
    }
  }

  /**
   * 处理规则判断。
   * 
   * @param {any} judgeInfo 判断条件信息
   * @param {any} content 要判断的数据
   * @param {any} Success 判断成功回调
   * @param {any} Error 判断失败回调
   * @returns 
   * @memberof dealbusiness
   */
  __ProcessRuleJudge(judgeInfo, content, Success, Error, exeChilrenRules) {
    const { strByEval, strByThis, chilrenRules } = judgeInfo || {};
    let { failMsg } = judgeInfo || {};
    let __ExecResult = true;
    try {
      if (strByEval && strByEval !== '') {
        const __newEval = queryFormat(strByEval || ' ', content);
        Log.Print('执行 Eval 条件:%s', __newEval);
        __ExecResult = eval(__newEval);
      } else if (strByThis && strByThis !== '') {
        Log.Print('执行 this 条件:%s', strByThis);
        __ExecResult = new Function(strByThis).apply(content);
      }
    } catch (ex) {
      failMsg = '判断条件规则内容出错了：' + ex.message;
      Log.Print('执行判断条件时出错了：%s', ex.message);
      __ExecResult = false;
    }
    Log.Print('执行结果为：', __ExecResult);
    if (!__ExecResult) { // 判断失败，执行失败的时候，规则集合.
      if (chilrenRules && chilrenRules.length > 0) {
        exeChilrenRules && exeChilrenRules(chilrenRules);
        return;
      }
      Error && Error(failMsg);
      return;
    }
    Success && Success();
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
    return values && values.length > 0 ? values[0] : { code: 200, msg: 'ok' };
  }

}

module.exports = dealbusiness;


