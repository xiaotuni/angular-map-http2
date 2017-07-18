const DbHelper = require('./DbHelper');
const Utility = require('../lib/commonMethod');
const UserInfo = require('./UserInfo');
const ApiHelper = require('./ApiHelper');
module.exports = {
  userinfo: new UserInfo(DbHelper, Utility),
  apihelper: new ApiHelper(),
};