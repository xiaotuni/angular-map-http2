import { Injectable } from '@angular/core';
import { Client } from './Core';

@Injectable()
export class ServiceHelper {

  public UserInfo:any;

  Login(obj: any): void {
    //
    console.log('ServiceHelper...', obj);
    const __List = { actions: { list: [], loading: 'Load', fail: 'Fail', complete: 'Complete' } };
    __List.actions.list.push({
      StateName: 'StateName',
      promise: (client) => client.get(client.API.Common.UserLogin, { params: obj, data: obj }),
      Condition: obj
    });
    const __self = this;
    Client(__List).then((result) => {
      __self.UserInfo = result && result[0] ? result[0] : [];
      console.log(JSON.stringify(__self.UserInfo));
    });
  }
}