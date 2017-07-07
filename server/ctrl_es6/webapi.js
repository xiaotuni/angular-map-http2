const DbHelper = require('./DbHelper');
const Utility = require('../lib/commonMethod');
const UserInfo = require('./UserInfo');
console.log('Utility', Utility);
module.exports = {
  userinfo: new UserInfo(DbHelper, Utility),
};