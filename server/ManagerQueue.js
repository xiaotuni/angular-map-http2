
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