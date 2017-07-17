import { Client } from './Core';

export class ApiManagerService {
  private __Client: any;
  public ApiList: any;

  constructor(private client) {
    this.__Client = client;
  }
  List(): Promise<any> {
    const __self = this;
    const options = {
      action: {
        promise: (client) => client.get(client.API.Api.List, { params: {} }),
        types: ['Loading', 'Success', 'Fail']
      },
    };
    return this.__Client(options).then((data) => {
      __self.ApiList = data;
      __self.ApiList.forEach(row => {
        const { Content } = row;
        try {
          row.RuleInfo = JSON.parse(Content);
        } catch (ex) { console.log(ex); }
      });
      return data;
    });
  }

  AddApi(Info: object): Promise<any> {
    const __self = this;
    const options = {
      action: {
        promise: (client) => client.post(client.API.Api.Add, { params: {}, data: Info }),
        types: ['Loading', 'Success', 'Fail']
      },
    };
    return this.__Client(options).then((data) => {
      __self.ApiList = data;
      __self.ApiList.forEach(row => {
        const { Content } = row;
        try {
          row.RuleInfo = JSON.parse(Content);
        } catch (ex) { console.log(ex); }
      });
      return data;
    });
  }
}