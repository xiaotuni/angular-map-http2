const mysql = require('mysql');

class MySqlHelper {

  constructor() {
    this.__Pool();
  }

  __Pool() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: 'localhost',
      user: 'liaohb',
      password: 'xiaotuni',
      database: 'nodejs'
    });
  }

  static instance() {
    if (!this.__Instance) {
      this.__Instance = new this();
    }
    return this.__Instance;
  }

  static Conn(error) {
    if (!this.__Conn) {
      const _inst = this.instance();
      this.__Conn = _inst.pool;
    }
    if (!this.__Conn) {
      error && error({ code: 500, msg: '数据库连接失败' });
      return null;
    }
    return this.__Conn;
  }

  static __ErrorInfo(error, msg) {

  }

  static Query(sql, success, error) {
    const conn = this.Conn(error);
    if (!conn) {
      return;
    }
    conn.query(sql, (err, result, fields) => {
      if (err) {
        error && error(err);
        return;
      }
      success && success({ fields, result });
    });
  }

  static QueryOne(sql, success, error) {
    this.Query(sql, (options) => {
      const { fields, result } = options;
      success && success({
        fields,
        result: result && result.length > 0 ? result[0] : {}
      });

    }, error);
  }
}

module.exports = MySqlHelper;
