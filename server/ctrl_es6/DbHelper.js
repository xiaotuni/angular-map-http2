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

const OperatorType = {
  Insert: 0,
  Update: 1,
  Delete: 2,
  QueryList: 3,
  QueryOne: 4,
}

class MySqlHelper {

  constructor() {
    this.__Pool();
  }

  __Pool() {
    this.pool = mysql.createPool({
      connectionLimit: 100,
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
      console.log('Connection %d released', connection.threadId);
    });
  }

  static instance() {
    if (!this.__Instance) {
      this.__Instance = new this();
    }
    return this.__Instance;
  }

  static poolInfo(error) {
    if (!this.__pool) {
      const _inst = this.instance();
      if (!_inst.pool) {
        _inst.__Pool();
      }
      this.__pool = _inst.pool;
    }
    if (!this.__pool) {
      error && error({ code: 500, msg: '数据库连接失败' });
      return null;
    }
    return this.__pool;
  }

  static Query(sql, success, error) {
    this.__ExecuteSQL(sql, success, error, OperatorType.QueryList);
  }

  static QueryOne(sql, success, error) {
    this.__ExecuteSQL(sql, success, error, OperatorType.QueryOne);
  }

  static UpdateSQL(Sql, Success, Error) {
    this.__ExecuteSQL(Sql, Success, Error, OperatorType.Update);
  }

  static InsertSQL(Sql, Success, Error) {
    this.__ExecuteSQL(Sql, Success, Error, OperatorType.Insert);
  }

  static DeleteSQL(Sql, Success, Error) {
    this.__ExecuteSQL(Sql, Success, Error, OperatorType.Delete);
  }

  static __ExecuteSQL(Sql, Success, Error, Type) {
    const __self = this;
    const __ProcessResult = (__sql, result, fields, Type) => {
      const _type = Type || OperatorType.QueryOne;
      let __result = result;
      switch (Type) {
        case OperatorType.Insert:
          console.log('插入SQL语句：[', __sql, ']');
          const { insertId } = result;
          __result = { insertId };
          break;
        case OperatorType.Delete:
          console.log('删除SQL语句：[', __sql, ']');
          break;
        case OperatorType.Update:
          console.log('更新SQL语句：[', __sql, ']');
          break;
        case OperatorType.QueryList:
          console.log('查询SQL语句：[', __sql, ']');
          break;
        case OperatorType.QueryOne:
          console.log('查询SQL语句：[', __sql, ']');
          __result = result && result.length > 0 ? result[0] : null;
          break;
      }
      return __result;
    };
    const { IsBeginTrConn, BeginTrConn } = this;
    if (!!IsBeginTrConn) {
      console.log('事务线程ID：', BeginTrConn.threadId);
      // 事务处理
      BeginTrConn.query(Sql, (err, result, fields) => {
        if (err) {
          __self.Rollback(err);
          Error && Error(err);
          return;
        }
        const __result = __ProcessResult(Sql, result, fields, Type);
        Success && Success({ fields, result: __result });
      });
    } else {
      const poolInfo = this.poolInfo(Error);
      if (!poolInfo) {
        return;
      }
      const __query = poolInfo.query(Sql, (err, result, fields) => {
        if (err) {
          Error && Error(err);
          return;
        }
        const __result = __ProcessResult(__query.sql, result, fields, Type);
        Success && Success({ fields, result: __result });
      });
    }
  }

  static BeginTransaction(Success, Error) {
    const poolInfo = this.poolInfo(Error);
    if (!poolInfo) {
      return;
    }
    const __self = this;
    poolInfo.getConnection((err, conn) => {
      if (err) {
        Error && Error(err);
      }
      conn.beginTransaction((btErr) => {
        if (btErr) {
          Error && Error(btErr);
        }
        console.log('开始事务处理...');
        __self.BeginTrConn = conn;
        __self.IsBeginTrConn = true;
        Success && Success();
      });
    });
  }

  static Rollback(ErrorInfo) {
    const { IsBeginTrConn, BeginTrConn } = this;
    const __self = this;
    if (!IsBeginTrConn) {
      return;
    }
    if (!BeginTrConn) {
      return;
    }

    console.log('Rollback->事务线程ID：', BeginTrConn.threadId);
    BeginTrConn.rollback(() => {
      console.log('事务回滚,回滚原因：', ErrorInfo);
      delete __self.IsBeginTrConn;
      delete __self.BeginTrConn;
    });
  }

  static Commit(Success, Error) {
    const { IsBeginTrConn, BeginTrConn } = this;
    const __self = this;
    if (!IsBeginTrConn) {
      return;
    }
    if (!BeginTrConn) {
      return;
    }
    BeginTrConn.commit((err) => {
      if (err) {
        console.log('事务提交失败，执行回滚操作...');
        __self.Rollback(err);
        Error && Error(err);
        return;
      }
      console.log('事务提交成功...');
      console.log('Commit->事务提交成功...事务ID：', BeginTrConn.threadId);
      delete __self.IsBeginTrConn;
      delete __self.BeginTrConn;
      Success && Success();
    });
  }

  static ClosePool(Success, Error) {
    const __self = this;
    const poolInfo = this.poolInfo(Error);
    if (!poolInfo) {
      return;
    }
    poolInfo.end((err) => {
      if (err) {
        Error && Error(err);
        return;
      }
      Success && Success();

      if (__self.__pool) {
        const _inst = __self.instance();
        delete _inst.pool;
        delete __self.__pool;
      }

    });
  }
}

module.exports = MySqlHelper;

  // static InsertSQL1(TableName, data, success, error) {
  //   const conn = this.Conn(error);
  //   if (!conn) {
  //     return;
  //   }
  //   // const sql = "insert into ?? set ?" 
  //   const __query = conn.query('insert into ?? set ?', [TableName, data], (err, result, fields) => {
  //     console.log(__query.sql);
  //     if (err) {
  //       error && error(err);
  //       return;
  //     }
  //     success && success({ fields, result });
  //   });
  // }

  // static DeleteSQL1(TableName, Where, Success, Error) {
  //   const conn = this.Conn(Error);
  //   if (!conn) {
  //     return;
  //   }
  //   // const sql = "delete from ?? where ?" 
  //   const __query = conn.query('delete from ?? where ?', [TableName, Where], (err, result, fields) => {
  //     console.log(__query.sql);
  //     if (err) {
  //       Error && Error(err);
  //       return;
  //     }
  //     Success && Success({ fields, result });
  //   });

  // }
