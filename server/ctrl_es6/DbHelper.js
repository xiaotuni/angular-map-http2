const mysql = require('mysql');

const queryFormat = function (query, values) {
  if (!values) return query;
  return query.replace(/\:(\w+)/g, function (txt, key) {
    if (values.hasOwnProperty(key)) {
      return this.escape(values[key]);
    }
    return txt;
  }.bind(this));
};

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
      // console.log('--------');
    });
    this.pool.on('release', function (connection) {
      // console.log('Connection %d released', connection.threadId);
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
    // const a = queryFormat('select * from xtn_userinfo t where t.username = :username', { username: 'admin' });
    // console.log(a);
    const __query = conn.query(sql, (err, result, fields) => {
      console.log('查询SQL语句：[', __query.sql, ']');
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
        result: result && result.length > 0 ? result[0] : null
      });

    }, error);
  }

  static InsertSQL1(TableName, data, success, error) {
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

  static DeleteSQL1(TableName, Where, Success, Error) {
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
    const conn = this.Conn(error);
    if (!conn) {
      return;
    }
    const __query = conn.query(Sql, (err, result, fields) => {
      console.log(__query.sql);
      if (err) {
        Error && Error(err);
        return;
      }
      Success && Success({ fields, result });
    });
  }

  static BatchExecuteSQL(SqlCollection, Success, Error) {

  }



  static UpdateSQL(Sql, Success, Error) {
    const conn = this.Conn(Error);
    if (!conn) {
      return;
    }
    const __query = conn.query(Sql, (err, result, fields) => {
      console.log('更新SQL语句：[', __query.sql, ']');
      if (err) {
        Error && Error(err);
        return;
      }
      Success && Success({ fields, result });
    });
  }

  static InsertSQL(Sql, Success, Error) {
    const conn = this.Conn(Error);
    if (!conn) {
      return;
    }
    const __query = conn.query(Sql, (err, result, fields) => {
      console.log('插入SQL语句：[', __query.sql, ']');
      if (err) {
        Error && Error(err);
        return;
      }
      const { insertId } = result;
      Success && Success({ fields, result: { insertId } });
    });
  }

  static DeleteSQL(Sql, Success, Error) {
    const conn = this.Conn(Error);
    if (!conn) {
      return;
    }
    const __query = conn.query(Sql, (err, result, fields) => {
      console.log('删除SQL语句：[', __query.sql, ']');
      if (err) {
        Error && Error(err);
        return;
      }
      Success && Success({ fields, result });
    });
  }
}

module.exports = MySqlHelper;
