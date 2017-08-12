/**
 * 队列管理，主要是用来处理量请求时
 * 由于要调用数据库，大量的请求,在调用的时候
 * 前面调用 .end方法，后面就会出现在pool close的情况。
 * 
 * 也许还有其它好的办法，目前就想到了这种方法。
 * 
 * @class ManagerQueue
 */
class ManagerQueue {

  /**
   * 创建一个带参数的构造函数 
   * @param {any} MySqlHelper  mysql操作类
   * @memberof ManagerQueue
   */
  constructor(MySqlHelper) {
    this._Queue = [];
    this.IsLock = false;
    this.MySqlHelper = MySqlHelper;
  }

  /**
   * 添加请求到队列里
   * 
   * @param {any} options  参数
   * @memberof ManagerQueue
   */
  AddQueue(options) {
    this._Queue.push(options);
    this.GetQueueLength();
    if (!this.IsLock) {
      this.IsLock = true;
      const args = this._Queue.shift();
      setTimeout(() => {
        this.NextQueue(args);
      }, 0);
    }
  }

  /**
   * 下一个
   * 
   * @returns 
   * @memberof ManagerQueue
   */
  Next() {
    const { _Queue } = this;
    if (_Queue.length === 0) {
      this.IsLock = false;
      console.log('---------队列处理完了------');
      return;
    }
    this.GetQueueLength();
    setTimeout(() => {
      this.NextQueue(_Queue.shift());
    }, 0);
  }

  /**
   * 执行下一请求
   * 
   * @param {any} args 
   * @returns 
   * @memberof ManagerQueue
   */
  NextQueue(args) {
    const { ApiInfo, request, response, params, data, token, TokenCollection, func, ctrl, methodInfo } = args;
    if (func) {
      func.apply(ctrl, [request, response, { params, data, token }]);
      return;
    }
    const _db = new this.MySqlHelper(); // 实例化一个数据库操作类
    _db.__TokenCollection__ = TokenCollection;
    ApiInfo.DealBusiness.Process(_db, request, response, { methodInfo, params, data, token });
  }

  /**
   * 
   * 
   * @memberof ManagerQueue
   */
  GetQueueLength() {
    console.log('---------队列大小为：【%d】--------', this._Queue.length);
    return this._Queue.length;
  }
}

module.exports = ManagerQueue;