// const DbHelper = require('./DbHelper');
const webapi = require('./webapi');

const DealBusiness = require('./DealBusiness');
module.exports = {
  webapi,
  DealBusiness: new DealBusiness()
}