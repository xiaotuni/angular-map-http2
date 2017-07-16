import { Client } from './Core';

export class ApiManagerService {
  private __Client: any;
  public ApiList: any;

  constructor(private client) {
    this.__Client = client;
  }
  List(): Promise<any> {
    console.log('api list');
    const __self = this;
    const options = {
      action: {
        promise: (client) => client.get(client.API.Api.List, { params: {} }),
        types: ['Loading', 'Success', 'Fail']
      },
    };
    return this.__Client(options).then((data) => {
      __self.ApiList = data;
      return data;
    });
  }
}