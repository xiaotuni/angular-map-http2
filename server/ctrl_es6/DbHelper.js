const Utility = require('../lib/Utility');
const Log = new Utility().Log;

const mysql = require('mysql');

/**
 * 操作类型，插入，更新，删除，查询
 */
const OperatorType = {
  Insert: 0,
  Update: 1,
  Delete: 2,
  QueryList: 3,
  QueryOne: 4,
}

/**
 * 数据操作类
 * QueryOne、Query、InsertSQL、DeleteSQL、UpdateSQL、BeginTransaction、Rollback、Commit
 * 
 * @class MySqlHelper
 */
class MySqlHelper {

  constructor() {
    this.__CreatePool();
  }

  /**
   * 创建一个资源池
   * 
   * @memberof MySqlHelper
   */
  __CreatePool() {
    this.pool = mysql.createPool({
      connectionLimit: 5,
      host: 'localhost', // 数据库连接
      user: 'liaohb',    // 数据库名用户名
      password: 'xiaotuni', // 密码
      database: 'nodejs'   // 表空间
    });

    this.pool.on('connection', function (cnn) {
      // connection.query('SET SESSION auto_increment_increment=1')
    });
    this.pool.on('release', function (cnn) {
      // console.log('===Connection【 %d 】 released===', cnn.threadId);
    });
  }

  /**
   * 资源池信息
   * 
   * @param {any} error 出错事件出得函数
   * @returns 
   * @memberof MySqlHelper
   */
  poolInfo(error) {
    if (!this.pool) {
      this.__CreatePool();
    }
    if (!this.pool) {
      error && error({ code: 500, msg: '数据库连接失败' });
      return null;
    }
    return this.pool;
  }
  /**
   * 插入操作
   * 
   * @param {any} sql 插入语句
   * @param {any} success 成功后调用的方法
   * @param {any} error 失败后调用的方法
   * @memberof MySqlHelper
   */
  Query(sql, success, error) {
    this.__ExecuteSQL(sql, success, error, OperatorType.QueryList);
  }
  /**
   * 查询操作，获取一条语句
   * 
   * @param {any} sql 插入语句
   * @param {any} success 成功后调用的方法
   * @param {any} error 失败后调用的方法
   * @memberof MySqlHelper
   */
  QueryOne(sql, success, error) {
    this.__ExecuteSQL(sql, success, error, OperatorType.QueryOne);
  }
  /**
   * 更新操作
   * 
   * @param {any} Sql 修改语句
   * @param {any} Success 成功后调用的方法
   * @param {any} Error 失败后调用的方法
   * @memberof MySqlHelper
   */
  UpdateSQL(Sql, Success, Error) {
    this.__ExecuteSQL(Sql, Success, Error, OperatorType.Update);
  }

  /**
   * 插入操作
   * 
   * @param {any} Sql 插入语句
   * @param {any} Success 成功后调用的方法
   * @param {any} Error 失败后调用的方法
   * @memberof MySqlHelper
   */
  InsertSQL(Sql, Success, Error) {
    this.__ExecuteSQL(Sql, Success, Error, OperatorType.Insert);
  }

  BatchInsertSQL(Sql, values, Success, Error) {
    const { IsBeginTrConn, BeginTrConn } = this;
    const __self = this;
    if (!!IsBeginTrConn) {
      Log.Print('事务线程ID：', BeginTrConn.threadId);
      // 事务处理
      const bSQL = BeginTrConn.query(Sql, [values], (err, result, fields) => {
        console.log('---------batch insert-------------------');
        console.log(bSQL.sql);
        console.log('---------batch insert-------------------');
        if (err) {
          Log.Print('执行此SQL【 %s 】出错了，请检查SQL语句是否正确。', bSQL.sql);
          __self.Rollback(err);
          Error && Error(err);
          return;
        }
        Success && Success({ fields, result });
      });
      return;
    }

    const poolInfo = this.poolInfo(Error);
    if (!poolInfo) {
      return;
    }
    poolInfo.getConnection((err, cnn) => {
      if (err) {
        Log.Print('获取数据库连接出错了。', Sql);
        Error && Error(err);
        return;
      }
      const _q = cnn.query(Sql, [values], (er, result, fields) => {
        console.log('---------batch insert-------------------');
        console.log(_q.sql);
        console.log('---------batch insert-------------------');
        cnn.release();
        if (er) {
          Log.Print('执行此SQL【 %s 】出错了，请检查SQL语句是否正确。', _q.sql);
          Error && Error(er);
          return;
        }

        Success && Success({ fields, result });
      });
    });
  }

  /**
   * 删除操作
   * 
   * @param {any} Sql 删除语句
   * @param {any} Success 成功后调用的方法
   * @param {any} Error 失败后调用的方法
   * @memberof MySqlHelper
   */
  DeleteSQL(Sql, Success, Error) {
    this.__ExecuteSQL(Sql, Success, Error, OperatorType.Delete);
  }

  /**
   * 执行SQL语句
   * 
   * @param {any} Sql SQL语句
   * @param {any} Success 成功后调用的方法
   * @param {any} Error 失败后调用的方法
   * @param {any} Type 类型[查询，更新，删除，修改等]
   * @returns 
   * @memberof MySqlHelper
   */
  __ExecuteSQL(Sql, Success, Error, Type) {
    const __self = this;
    const __ProcessResult = (__sql, result, fields, Type) => {
      const _type = Type || OperatorType.QueryOne;
      let __result = result;
      switch (Type) {
        case OperatorType.Insert:
          const { insertId } = result;
          __result = { insertId };
          break;
        case OperatorType.Delete:
          break;
        case OperatorType.Update:
          break;
        case OperatorType.QueryList:
          break;
        case OperatorType.QueryOne:
          __result = result && result.length > 0 ? result[0] : null;
          break;
      }
      return __result;
    };
    const { IsBeginTrConn, BeginTrConn } = this;
    if (!!IsBeginTrConn) {
      Log.Print('事务线程ID：', BeginTrConn.threadId);
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
      const __self = this;
      this.getConnection().then((cnn) => {
        return __self.getQuery(cnn, Sql);
      }).then(({ result, fields }) => {
        const __result = __ProcessResult(Sql, result, fields, Type);
        Success && Success({ fields, result: __result });
      }).catch((ex) => {
        console.log(ex);
        Error && Error(er);
      });

      // poolInfo.getConnection((err, cnn) => {
      //   if (err) {
      //     Log.Print('执行此SQL【 %s 】出错了，请查询SQL语句是否正确。', Sql);
      //     Error && Error(err);
      //     return;
      //   }
      //   cnn.query(Sql, (er, result, fields) => {
      //     cnn.release();
      //     if (er) {
      //       Log.Print('执行此SQL【 %s 】出错了，请查询SQL语句是否正确。', Sql);
      //       Error && Error(er);
      //       return;
      //     }
      //     const __result = __ProcessResult(Sql, result, fields, Type);
      //     Success && Success({ fields, result: __result });
      //   });
      // });
    }
  }

  getQuery(cnn, Sql) {
    return new Promise((resolve, reject) => {
      cnn.query(Sql, (er, result, fields) => {
        cnn.release();
        if (er) {
          Log.Print('执行此SQL【 %s 】出错了，请查询SQL语句是否正确。', Sql);
          reject(er);
          return;
        }
        resolve({ result, fields });
      });
    });
  }
  getConnection() {
    return new Promise((resolve, reject) => {
      const poolInfo = this.poolInfo(Error);
      if (!poolInfo) {
        return;
      }
      poolInfo.getConnection((err, cnn) => {
        if (err) {
          Log.Print('执行此SQL【 %s 】出错了，请查询SQL语句是否正确。', Sql);
          reject(err);
          return;
        }
        resolve(cnn);
      });
    });
  }

  /**
   * 开启事务
   * 
   * @param {any} Success 成功后调用的方法
   * @param {any} Error 失败后调用的方法
   * @returns 
   * @memberof MySqlHelper
   */
  BeginTransaction(Success, Error) {
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
        Log.Print('开始事务处理...');
        __self.BeginTrConn = conn;
        __self.IsBeginTrConn = true;
        Success && Success();
      });
    });
  }

  /**
   * 事务回滚
   * 
   * @param {any} ErrorInfo 回滚出错信息
   * @returns 
   * @memberof MySqlHelper
   */
  Rollback(ErrorInfo) {
    const { IsBeginTrConn, BeginTrConn } = this;
    const __self = this;
    if (!IsBeginTrConn) {
      return;
    }
    if (!BeginTrConn) {
      return;
    }

    Log.Print('Rollback->事务线程ID：', BeginTrConn.threadId);
    BeginTrConn.rollback(() => {
      Log.Print('事务回滚,回滚原因：', ErrorInfo);
      delete __self.IsBeginTrConn;
      delete __self.BeginTrConn;
    });
  }

  /**
   * 提交事件
   * 
   * @param {any} Success 成功后调用的方法
   * @param {any} Error 失败后调用的方法
   * @returns 
   * @memberof MySqlHelper
   */
  Commit(Success, Error) {
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
        Log.Print('事务提交失败，执行回滚操作...');
        __self.Rollback(err);
        Error && Error(err);
        return;
      }
      Log.Print('Commit->事务提交成功...事务ID：', BeginTrConn.threadId);
      delete __self.IsBeginTrConn;
      delete __self.BeginTrConn;
      Success && Success();
    });
  }

  /**
   * 关闭连接池
   * 
   * @param {any} Success 
   * @param {any} Error 
   * @returns 
   * @memberof MySqlHelper
   */
  ClosePool(Success, Error) {
    // Success && Success();
    const __self = this;
    const poolInfo = this.poolInfo(Error);
    if (!poolInfo) {
      Success && Success();
      return;
    }
    poolInfo.end((err) => {
      if (err) {
        Error && Error(err);
        return;
      }
      Success && Success();
      if (__self.pool) {
        delete __self.pool;
        delete __self.__pool;
      }
    });
  }
}

module.exports = MySqlHelper;
