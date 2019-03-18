import { MySqlHelper, Utility, RedisService } from ".";


export default class DealBusinessService {

  /**
   * 格式化 字符串
   *
   * @param {*} query
   * @param {*} values
   * @returns
   * @memberof DealBusinessService
   */
  queryFormat(query, values) {
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

  /**
   * 格式化SQL语语句。
   *
   * @param {*} { id, sql, options }
   * @returns
   * @memberof DealBusinessService
   */
  FormatSQL({ id, sql, options }) {
    const _FormatSQL = this.queryFormat(sql || '', options);
    // if (_FormatSQL) {
    //   Utility.printLog(`id序号 =>【${id}】--执行的SQL语句【${_FormatSQL}】`);
    // }
    return _FormatSQL;
  }

  /**
   * 查询。
   *
   * @param {*} { id, sql, isRows, options }
   * @returns
   * @memberof DealBusinessService
   */
  async query({ id, sql, isRows, options }) {
    const newSql = this.FormatSQL({ id, sql, options });
    if (isRows) {
      return MySqlHelper.Query(newSql);
    }
    return MySqlHelper.QueryOne(newSql);
  }

  /**
   * 获取要处理的规则
   *
   * @param {*} cmd
   * @param {*} method
   * @returns
   * @memberof DealBusinessService
   */
  async getRule(cmd, method) {
    const sql = `select * from xtn_sys_rule t where t.status = 1 and t.PathName = '${cmd}' and t.Method = '${method}'`;
    return MySqlHelper.QueryOne(sql);
  }

  /**
   * 字段值核查
   *
   * @param {*} fields
   * @param {*} options
   * @returns
   * @memberof DealBusinessService
   */
  checkFieldValue(fields, options) {
    const _fieldItem = fields.split(',');
    const emptyFields = [];
    for (let i = 0; i < _fieldItem.length; i += 1) {
      // 判断值是否存在
      const field = _fieldItem[i];
      if (!options[field] && options[field] !== 0) {
        emptyFields.push(field);
      }
    }

    if (Utility.isArray(emptyFields)) {
      Utility.printLog('emptyFields:', emptyFields);
      Utility.throwClientError({ msg: `【${emptyFields.join(',')}】 不能为空。` });
    }

    return true;
  }

  /**
   * 处理规则的入口。
   *
   * @param {*} options
   * @param {*} ruleInfo
   * @returns
   * @memberof DealBusinessService
   */
  async processRule(options, ruleInfo) {
    const { Content } = ruleInfo;
    const { rules, fields, result } = JSON.parse(Content);

    this.checkFieldValue(fields, options);
    if (!options.Result) {
      options.Result = {};
    }

    await this.__process_Rules(options, rules);

    return options;
  }

  /**
   * 规则集合处理
   *
   * @param {*} options
   * @param {*} rules
   * @returns
   * @memberof DealBusinessService
   */
  async __process_Rules(options, rules) {

    if (!Utility.isArray(rules)) {
      return;
    }

    for (let i = 0; i < rules.length; i += 1) {
      const rule = rules[i];
      const { id, type, name } = rule;
      const _fName = `process_${type}`;
      if (!this[_fName]) {
        continue;
      }
      try {
        Utility.printLog('当前正处理第', id, '个规则，类型为：', _fName);
        const row = await this[_fName](options, rule);
        options.Result[id] = { name, result: row };

      } catch (ex) {
        Utility.printLog('参数为:', id, JSON.stringify(options));
        Utility.throwClientError({ msg: ex.message });
      }

      if (i === 5) {
        break;
      }
    }
  }

  /**
   * 插入
   *
   * @param {*} options
   * @param {*} ruleInfo
   * @returns
   * @memberof DealBusinessService
   */
  async process_insert(options, ruleInfo) {
    const { id, sql, name } = ruleInfo;
    const __sql = this.FormatSQL({ id, sql, options });

    const result = await MySqlHelper.InsertSQL(__sql);
    const { insertId } = result;
    options[name || 'InsertNo'] = insertId;
    return { InsertNo: insertId };
  }

  /**
   * 查询
   *
   * @param {*} options
   * @param {*} ruleInfo
   * @returns
   * @memberof DealBusinessService
   */
  async process_query(options, ruleInfo) {
    const { id, sql, isRows, name, resultName, isMergeOption } = ruleInfo;
    const __sql = this.FormatSQL({ id, sql, options });
    if (id === 6) {
      Utility.printLog('---sql :', __sql);
    }
    if (isRows) {
      const { result } = await MySqlHelper.Query(__sql);
      return result;
    }

    const row = await MySqlHelper.QueryOne(__sql);
    if (isMergeOption) {
      Object.assign(options, row);
    }
    return row;

  }

  /**
   * 验证码
   *
   * @param {*} options
   * @param {*} ruleInfo
   * @returns
   * @memberof DealBusinessService
   */
  async process_captcha(options, ruleInfo) {
    const { sessionId, session } = options;
    const { id, captcha } = ruleInfo;
    const { fail, field, timeout, isDelete } = captcha || {};
    const _key = `sid-${sessionId}`;
    const sessionValue = await RedisService.GetObject(_key);
    if (isDelete) {
      // delete sessionValue[field];
      // await RedisService.SetObject(_key, sessionValue);
      // return { result: true }
    }
    // 判断是否相同。
    if (sessionValue[field].toLowerCase() !== options[field].toLowerCase()) {
      Utility.throwClientError({ msg: '验证码错误' });
    }

    return { result: true };
  }

  /**
   * 条件判断
   *
   * @param {*} options
   * @param {*} ruleInfo
   * @returns
   * @memberof DealBusinessService
   */
  async process_judge(options, ruleInfo) {
    const { id, sql, judgeInfo } = ruleInfo;

    const _sql = this.FormatSQL({ id, sql, options });
    if (_sql) {
      const result = await MySqlHelper.QueryOne(_sql);
      Object.assign(options, result || {});
    }

    const { strByEval, strByThis, chilrenRules } = judgeInfo;

    let executeResult = true;
    try {
      if (strByEval) {
        const __newEval = this.queryFormat(strByEval, options);
        executeResult = eval(__newEval);
      }
      if (strByThis) {
        const _newThis = new Function(strByThis);
        executeResult = _newThis.apply(options);
      }
    } catch (ex) {
      Utility.throwClientError({ msg: `process_judge,判断条件出错了${ex.message}` });
      executeResult = false;
    }

    if (!executeResult && Utility.isArray(chilrenRules)) {
      await this.__process_Rules(options, chilrenRules);
    }
    return { result: true, executeResult };
  }

  /**
   * 删除操作。
   *
   * @param {*} options
   * @param {*} ruleInfo
   * @returns
   * @memberof DealBusinessService
   */
  async process_delete(options, ruleInfo) {
    const { id, sql } = ruleInfo;
    const _sql = this.FormatSQL({ id, sql, options });
    const result = await MySqlHelper.DeleteSQL(_sql);
    const { deleteCount } = result;
    return { result: true, deleteCount };
  }

  async process_cache(options, ruleInfo) {
    const { id } = ruleInfo;
    return {};
  }
}