import redis from 'redis';
import bluebird from 'bluebird';
import Utility from '../lib/Utility';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


const options = { host: '127.0.0.1', port: 6379, auth_pass: 'RedisPasswordXTNLHB2018' };

export default class ConnectRedis {
  constructor() {

  }

  /**
   * 初始化
   *
   * @static
   * @param {string} [options={ host: '127.0.0.1', port: 6379, auth_pass: 'RedisPasswordXTNLHB2018' }]
   * @returns
   * @memberof ConnectRedis
   */
  static init() {

    this.Client = redis.createClient({
      ...options,
      retry_strategy: (args) => {
        const { error, attempt, total_retry_time, times_connected } = args;
        const { code } = error;
        if (code === 'ECONNREFUSED') {
          Utility.printLog('在一个指定错误或一个冲掉所有命令的错误后结束重连');
          return new Error('The server refused the connection');
        }
        if (total_retry_time > 1000 * 60 * 60) {
          Utility.printLog('在一个指定超时或一个冲掉所有命令的错误后结束重连');
          return new Error('Retry time exhausted');
        }
        if (times_connected > 10) {
          Utility.printLog('在一个内置错误后结束重连');
          return undefined;
        }
        Utility.printLog('指定时间后重连');
        return Math.max(attempt * 100, 3000);
      }
    });

    this.Client.on('error', (err, b) => {
      Utility.printLog('Redis 连接出错了 ', err, b);
    });

    this.Client.on('end', (err, b) => {
      Utility.printLog('Redis end ', err, b);
    });

    this.Client.on('ready', (err) => {
      Utility.printLog('Redis 连接成功 ', err ? err : '');
    });

    return this.Client;
  }

  // static async Client() {
  //   if (!this.__client) {
  //     this.init();
  //   }
  //   return this.__client;
  // }
}
