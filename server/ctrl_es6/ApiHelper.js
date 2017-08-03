const DbHelper = require('./DbHelper');

class ApiHelper {

  constructor() {

  }

  post_api(request, response, options) {
    response.SendOk();
  }
  put_api(request, response, options) {
    response.SendOk();
  }
  delete_api(request, response, options) {
    response.SendOk();
  }
  
}

module.exports = ApiHelper;