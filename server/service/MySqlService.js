const mysql = require('mysql');

import { Utility } from '.';

/**
 * 操作类型，插入，更新，删除，查询
 */
const OperatorType = {
  Insert: 1,
  Update: 2,
  Delete: 3,
  QueryList: 4,
  QueryOne: 5,
}

/**
 * 数据操作类
 * QueryOne、Query、InsertSQL、DeleteSQL、UpdateSQL、BeginTransaction、Rollback、Commit
 * 
 * @class MySqlHelper
 */
export default class MySqlHelper {


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
      connectionLimit: 10,
      host: 'localhost',                      // 数据库连接
      user: 'nodejs',                         // 数据库名用户名
      password: 'nodejs@nodejs',              // 密码
      database: 'nodejs'                      // 表空间
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
  async Query(sql) {
    return this.__ExecuteSQL(sql, OperatorType.QueryList);
  }

  /**
   * 查询操作，获取一条语句
   * 
   * @param {any} sql 插入语句
   * @param {any} success 成功后调用的方法
   * @param {any} error 失败后调用的方法
   * @memberof MySqlHelper
   */
  async QueryOne(sql) {
    return this.__ExecuteSQL(`select * from ( ${sql} )v1 limit 0,1 `, OperatorType.QueryOne);
  }
  /**
   * 更新操作
   * 
   * @param {any} Sql 修改语句
   * @param {any} Success 成功后调用的方法
   * @param {any} Error 失败后调用的方法
   * @memberof MySqlHelper
   */
  async  UpdateSQL(Sql) {
    return this.__ExecuteSQL(Sql, OperatorType.Update);
  }

  /**
   * 插入操作
   * 
   * @param {any} Sql 插入语句
   * @param {any} Success 成功后调用的方法
   * @param {any} Error 失败后调用的方法
   * @memberof MySqlHelper
   */
  async InsertSQL(Sql) {
    return this.__ExecuteSQL(Sql, OperatorType.Insert);
  }

  /**
   * 批量插入
   *
   * @param {*} Sql
   * @param {*} values
   * @returns
   * @memberof MySqlHelper
   */
  async BatchInsertSQL(Sql, values) {
    const { IsBeginTrConn, BeginTrConn } = this;
    const __self = this;
    if (!!IsBeginTrConn) {
      Utility.printLog('事务线程ID：', BeginTrConn.threadId);
      // 事务处理
      const bSQL = BeginTrConn.query(Sql, [values], (err, result, fields) => {

        if (err) {
          Utility.printLog('执行此SQL【 %s 】出错了，请检查SQL语句是否正确。', bSQL.sql);
          __self.Rollback(err);
          Error && Error(err);
          return;
        }
        Success && Success({ fields, result });
      });
      return;
    }

    const conn = await this.getConnection();
    return new Promise((resolve, reject) => {
      const q = conn.query(Sql, [values], (err, result, fields) => {
        conn.release();
        if (err) {
          Utility.printLog(`执行此SQL【 ${q.sql} 】出错了，请检查SQL语句是否正确。`)
          reject(err);
        } else {
          resolve({ result, fields });
        }
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
  async DeleteSQL(Sql) {
    return this.__ExecuteSQL(Sql, OperatorType.Delete);
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
  async __ExecuteSQL(Sql, Type) {
    const { IsBeginTrConn, BeginTrConn } = this;
    if (!!IsBeginTrConn) {
      Log.Print('事务线程ID：', BeginTrConn.threadId);
      // return await this.getQueryTran(sql, Type);
    }
    return this.getQuery(Sql, Type);
  }

  __ProcessResult({ result, fields, type }) {
    const _type = type || OperatorType.QueryOne;
    let __result = result;
    const { insertId, affectedRows } = result;
    switch (_type) {
      case OperatorType.Insert:
        __result = { insertId };
        break;
      case OperatorType.Delete:
        __result = { deleteCount: affectedRows };
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
  }

  /**
   * 获取查询 
   *
   * @param {*} Sql
   * @returns
   * @memberof MySqlHelper
   */
  async getQuery(Sql, type = OperatorType.QueryList) {
    // Utility.printLog('getQuery:', Sql);
    const cnn = await this.getConnection();
    return new Promise((resolve, reject) => {
      cnn.query(Sql, (er, result, fields) => {
        cnn.release();
        if (er) {
          Utility.printLog(`执行此SQL【 ${Sql} 】出错了，请查询SQL语句是否正确。`);
          reject(er);
        } else {
          const data = this.__ProcessResult({ result, fields, type });
          resolve(data);
        }
      });
    });
  }

  async getQueryTran({ cnn, sql, type }) {
    return new Promise((resolve, reject) => {
      cnn.query(sql, (err, result, fields) => {
        if (err) {
          reject(err);
        } else {
          const data = this.__ProcessResult({ result, fields, type });
          resolve(data);
        }
      });
    });
  }
  /**
   * 获取连接
   *
   * @returns
   * @memberof MySqlHelper
   */
  async getConnection() {
    return new Promise((resolve, reject) => {
      const poolInfo = this.poolInfo(Error);
      if (!poolInfo) {
        reject({ msg: '连接池出错了' });
      }
      poolInfo.getConnection((err, cnn) => {
        if (err) {
          Utility.printLog('获取连接出错了');
          reject(err);
        } else {
          resolve(cnn);
        }
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
  async BeginTransaction() {
    const poolInfo = this.poolInfo(Error);
    if (!poolInfo) {
      return;
    }
    return new Promise((resolve, reject) => {
      poolInfo.getConnection((err, conn) => {
        if (err) {
          reject(err);
        }
        conn.beginTransaction((btErr) => {
          if (btErr) {
            reject(btErr);
          }
          Utility.printLog('开始事务处理...');
          resolve(conn);
        });
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
