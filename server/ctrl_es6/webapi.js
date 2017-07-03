
class webapi {
  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  dept() {
    this.response.Send({ key: 'webapi', method: 'dept' });
  }

}

module.exports = webapi;