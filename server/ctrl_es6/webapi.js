// const DbHelper = require('./DbHelper');
const UserInfo = require('./UserInfo');

// class webapi {
//   constructor(request, response) {
//     this.request = request;
//     this.response = response;
//     this.prototype.userinfo = new UserInfo();
//   }

//   static userinfo() {
//     if (this.__UserInfo) {

//     }
//     return new UserInfo();
//   }

//   dept() {
//     const a = DbHelper;
//     console.log(a);
//     const self = this;
//     a.Query('select * from xtn_userinfo', (data) => {
//       const { result } = data || {};
//       self.response.Send(result);
//     }, () => { });
//   }
//   static tempabc(request, response) {
//     const a = DbHelper;
//     a.QueryOne('select * from xtn_userinfo', (data) => {
//       const { result } = data || {};
//       response.Send(result);
//     }, () => { });
//   }

// }

module.exports = {
  userinfo: new UserInfo(),
};