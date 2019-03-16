import { MySqlHelper, Utility } from ".";


export default class DealBusinessService {

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

  FormatSQL({ id, sql, options }) {
    const _FormatSQL = this.queryFormat(sql || '', options);
    if (_FormatSQL) {
      Utility.printLog(`id序号 =>【${id}】--执行的SQL语句【${_FormatSQL}】`);
    }
    return _FormatSQL;
  }

  async query({ id, sql, isRows, options }) {
    const newSql = this.FormatSQL({ id, sql, options });
    if (isRows) {
      return MySqlHelper.Query(newSql);
    }
    return MySqlHelper.QueryOne(newSql);
  }
}