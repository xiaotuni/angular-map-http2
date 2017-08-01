export class ApiManagerService {
  private ApiClient: any;
  public ApiList: any;

  constructor(private client) {
    this.ApiClient = client;
  }
  List(): Promise<any> {
    const __self = this;
    const options = {
      action: {
        promise: (client) => client.get(client.API.Api.List, { params: {} }),
        types: ['Loading', 'Success', 'Fail']
      },
    };
    return this.ApiClient(options).then((data) => {
      __self.ApiList = data;
      if (Array.isArray(__self.ApiList)) {
        __self.ApiList.forEach(row => {
          const { Content } = row;
          try {
            row.RuleInfo = JSON.parse(Content);
          } catch (ex) { console.log(ex); }
        });
      }
      return data;
    });
  }

  AddApi(Info: object): Promise<any> {
    const __self = this;
    return new Promise((resolve, reject) => {
      const options = { action: { types: ['Loading', 'Success', 'Fail'], promise: (client) => client.post(client.API.Api.Add, { params: {}, data: Info }) } };
      __self.ApiClient(options).then((data) => {
        const { code, msg, Id } = data;
        if (code && msg) {
          // update 
        } else { // insert
          const _find = __self.ApiList.filter((row) => row.Id === Id);
          if (_find.length > 0) {
            // _find[0].RuleInfo = JSON.parse(data.Content);
          } else {
            data.RuleInfo = JSON.parse(data.Content);
            __self.ApiList.push(data);
          }
        }
        resolve(data);
      }, (ee) => {
        reject(ee);
      });
    });
  }

  Modify(Info: object): Promise<any> {
    const __self = this;
    const options = {
      action: {
        promise: (client) => client.put(client.API.Api.Modify, { params: {}, data: Info }),
        types: ['Loading', 'Success', 'Fail']
      },
    };
    return this.ApiClient(options).then((data) => {
      return data;
    });
  }

  DeleteById(rule) {
    const { Id } = rule;
    const __self = this;
    const options = {
      action: {
        promise: (client) => client.del(client.API.Api.Delete, { params: {}, data: { Id } }),
        types: ['Loading', 'Success', 'Fail']
      },
    };
    return this.ApiClient(options).then((data) => {
      const { ApiList } = __self;
      for (let i = 0; i < ApiList.length; i++) {
        if (ApiList[i].Id === Id) {
          ApiList.splice(i, 1);
          break;
        }
      }
      return data;
    }, (er) => {
      console.log(er);
    });
  }
}