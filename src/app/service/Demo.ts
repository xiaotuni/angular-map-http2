import { Client } from './Core';

export class DemoService {
  private __Client: any;

  constructor(private client) {
    this.__Client = client;
  }

  public UserInfo(methodType) {
    const __self = this;
    const options = {
      action: {
        promise: (client) => client[methodType](client.API.UserInfo.Info, { params: {} }),
        types: ['Loading', 'Success', 'Fail']
      },
    };
    return this.__Client(options).then((data) => {
      console.log(data);
      return data;
    });
  }

}