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

    this.pool.on('connection', function (connection) {
      // connection.query('SET SESSION auto_increment_increment=1')
      console.log('--------');
    });
    this.pool.on('release', function (connection) {
      console.log('Connection %d released', connection.threadId);
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

  static InsertSQL(TableName, data, success, error) {
    const conn = this.Conn(error);
    if (!conn) {
      return;
    }
    // const sql = "insert into ?? set ?" 
    const __query = conn.query('insert into ?? set ?', [TableName, data], (err, result, fields) => {
      console.log(__query.sql);
      if (err) {
        error && error(err);
        return;
      }
      success && success({ fields, result });
    });
  }

  static DeleteSQL(TableName, Where, Success, Error) {
    const conn = this.Conn(Error);
    if (!conn) {
      return;
    }
    // const sql = "delete from ?? where ?" 
    const __query = conn.query('delete from ?? where ?', [TableName, Where], (err, result, fields) => {
      console.log(__query.sql);
      if (err) {
        Error && Error(err);
        return;
      }
      Success && Success({ fields, result });
    });

  }

  static ExecuteProcedure(ProcedureName, Params, Success, Error) {

  }

  static ExecuteSQL(Sql, Success, Error) {

  }

  static BatchExecuteSQL(SqlCollection, Success, Error) {

  }
}

module.exports = MySqlHelper;
