const DbHelper = require('./DbHelper');
const Utility = require('../lib/commonMethod');
const UserInfo = require('./UserInfo');
module.exports = {
  userinfo: new UserInfo(DbHelper, Utility),
};