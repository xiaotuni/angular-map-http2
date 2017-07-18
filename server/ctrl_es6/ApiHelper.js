const DbHelper = require('./DbHelper');

class ApiHelper {

  constructor() {

  }

  post_api(request, response, options) {
    console.log('----post_api------');
    response.SendOk();
  }
  put_api(request, response, options) {
    console.log('-------put_api---');
    response.SendOk();
  }
  delete_api(request, response, options) {
    console.log('-------delete_api---');
    response.SendOk();
  }
  
}

module.exports = ApiHelper;