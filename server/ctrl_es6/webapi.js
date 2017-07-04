
const DbHelper = require('./DbHelper');

class webapi {
  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  dept() {
    const a = DbHelper;
    console.log(a);
    const self = this;
    a.Query('select * from xtn_userinfo', (data) => {
      const { result } = data || {};
      self.response.Send(result);
    }, () => { });
    // this.response.Send({ key: 'webapi', method: 'dept' });
  }
  static tempabc(request, response) {
    const a = DbHelper;
    a.QueryOne('select * from xtn_userinfo', (data) => {
      const { result } = data || {};
      response.Send(result);
    }, () => { });
  }
  
}

module.exports = webapi;