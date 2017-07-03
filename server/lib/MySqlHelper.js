const mysql = require('mysql');
// import mysql from 'mysql';

exports.MySqlHelper = {
  __pool: null,
  pool() {
    if (!this.__pool) {
      this.__pool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'liaohb',
        password: 'xiaotuni',
        database: 'nodejs'
      });
      // this.__pool.on('acquire', (conn) => {
      //   console.log('当前连接线程为：%d', conn.threadId);
      // });
      // this.__pool.on('connection', () => {
      //   console.log('connection...');
      // });
      // this.__pool.on('enqueue', () => {
      //   console.log('等待可用连接...');
      // });
    }
    return this.__pool;
  },
  __Error(err, msg) {
    err({ code: 500, msg });
  },
  Query(sql, success, error) {
    const conn = this.pool();
    if (!conn) {
      this.__Error(error, '数据库接连失败...');
      return;
    }
    if (!sql) {
      this.__Error(error, '请输入要查询的SQL语句...');
      return;
    }
    conn.query(sql, (err, result, fields) => {
      if (err) {
        error(err);
      }
      success(fields, result);
    });
  },
  QueryOne(sql, success, error) {
    const conn = this.pool();
    if (!conn) {
      this.__Error(error, '数据库连接失败...');
      return;
    }
    if (!sql) {
      this.__Error(error, '请输入要查询的SQL语句...');
      return;
    }
    conn.query(sql, (err, result, fields) => {
      if (err) {
        error && this.__Error(error, JSON.stringify(err));
        return;
      }
      success && success(fields, result && result.length > 0 ? result[0] : {});
    });
  }

}