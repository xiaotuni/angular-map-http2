const webapi = require('./webapi');

const DealBusiness = require('./DealBusiness');

const GetToken = () => { }

module.exports = {
  webapi,
  DealBusiness: new DealBusiness()
}