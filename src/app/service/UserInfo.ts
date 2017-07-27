import { Utility } from './Core';

export class UserInfoService {
  constructor(private Client) {
  }

  public UserInfo: any;
  public Users: any[];
  Login(obj: any): Promise<any> {
    const __List = { actions: { list: [], loading: 'Load', fail: 'Fail', complete: 'Complete' } };
    __List.actions.list.push({
      StateName: 'StateName', Condition: obj,
      promise: (client) => client.post(client.API.UserInfo.Login, { data: obj }),
    });
    const __self = this;
    return this.Client(__List).then((result) => {
      __self.UserInfo = result && result[0] ? result[0] : [];
      // 将token保存下来。
      Utility.$SetContent(Utility.$ConstItem.UserInfo, __self.UserInfo, true);
      console.log(JSON.stringify(__self.UserInfo));
      return result;
    });
  }

  AddUser(obj: any): Promise<any> {
    const __List = { actions: { list: [], loading: 'Load', fail: 'Fail', complete: 'Complete' } };
    __List.actions.list.push({
      StateName: 'StateName', Condition: obj,
      promise: (client) => client.post(client.API.Common.AddUser, { data: obj }),
    });
    const __self = this;
    return this.Client(__List).then((result) => {
      __self.UserInfo = result && result[0] ? result[0] : [];
      console.log(JSON.stringify(__self.UserInfo));
      return result;
    });
  }

  Userlist(cnd: any): Promise<any> {
    const __List = { actions: { list: [], loading: 'Load', fail: 'Fail', complete: 'Complete' } };
    __List.actions.list.push({
      StateName: 'StateName', Condition: cnd,
      promise: (client) => client.get(client.API.Common.Userlist, { params: cnd }),
    });
    const __self = this;
    return this.Client(__List).then((result) => {
      __self.Users = result && result[0] ? result[0] : [];
      return result && result[0] ? result[0] : [];
    });
  }

  DeleteUser(item: any): Promise<any> {
    const action = {
      StateName: 'StateName', types: ['Loading', 'Success', 'Fail'], Condition: item,
      promise: (client) => client.del(client.API.Common.DeleteUser, { params: { id: item.id } }),
    };
    const __self = this;
    return this.Client({ action }).then((result) => {
      for (let i = 0; i < __self.Users.length; i++) {
        const row = __self.Users[i];
        if (row.id === item.id) {
          __self.Users.splice(i, 1);
          break;
        }
      }
      return result;
    });
  }
}