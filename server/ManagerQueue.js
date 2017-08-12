/**
 * 队列管理，主要是用来处理量请求时
 * 由于要调用数据库，大量的请求，就必须创建大量的数据库连接，
 * 而数据库连接是由限制的，所以在这里添加一个队列，
 * 可以有效的解决数据库连接超过最大限制问题.
 * 
 * 也许还有其它好的办法，目前就想到了这种方法。
 * 
 * @class ManagerQueue
 */
class ManagerQueue {

  constructor(MySqlHelper) {
    this._Query = [];
    this.IsLock = false;
    this.MySqlHelper = MySqlHelper;
  }

  AddQueue(options) {
    this._Query.push(options);
    this.GetQueueLength();
    if (!this.IsLock) {
      this.IsLock = true;
      const args = this._Query.shift();
      setTimeout(() => {
        this.NextQueue(args);
      }, 0);
    }
  }

  Next() {
    const { _Query } = this;
    if (_Query.length === 0) {
      this.IsLock = false;
      console.log('---------队列处理完了------');
      return;
    }
    this.GetQueueLength();
    setTimeout(() => {
      this.NextQueue(_Query.shift());
    }, 0);
  }

  NextQueue(args) {
    const { ApiInfo, request, response, params, data, token, TokenCollection, func, ctrl, methodInfo } = args;
    // 查询用户定义好的接口。
    if (func) {
      func.apply(ctrl, [request, response, { params, data, token }]);
      return;
    }
    const _db = new this.MySqlHelper(); // 实例化一个数据库操作类
    _db.__TokenCollection__ = TokenCollection;
    ApiInfo.DealBusiness.Process(_db, request, response, { methodInfo, params, data, token });
  }

  GetQueueLength() {
    console.log('---------队列大小为：【%d】--------', this._Query.length);
  }
}

module.exports = ManagerQueue;