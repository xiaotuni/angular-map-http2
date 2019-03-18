import { Utility } from './Core';
import HttpHelper from 'app/helpers/HttpHelper';

export class UserInfoService {
  public UserInfo: any;
  public Users: any[];

  constructor(private Client) {
  }

  /**
   * 用户登录
   * 
   * @param {*} obj 
   * @returns {Promise<any>} 
   * @memberof UserInfoService
   */
  async Login(obj: any): Promise<any> {
    try {

      const result = await HttpHelper.post('/msuser', { data: obj });
      console.log('1234----', result);
      return result;
    } catch (ex) {
      console.log('---------------1234--------------', ex);
    }
  }

  /**
   * 添加用户
   * 
   * @param {*} obj 
   * @returns {Promise<any>} 
   * @memberof UserInfoService
   */
  AddUser(obj: any): Promise<any> {
    const __List = { actions: { list: [], loading: 'Load', fail: 'Fail', complete: 'Complete' } };
    __List.actions.list.push({
      StateName: 'StateName', Condition: obj,
      promise: (client) => client.post(client.API.Common.AddUser, { data: obj, isFormData: true }),
    });
    const __self = this;
    return this.Client(__List).then((result) => {
      __self.UserInfo = result && result[0] ? result[0] : [];
      return result;
    });
  }

  Register(userInfo): Promise<any> {
    const fd = new FormData();
    const nValue = Object.assign({}, userInfo);
    delete nValue.FileList;
    userInfo.FileList.forEach((file) => {
      fd.append('fileCollection', file, file.name);
    });
    userInfo.fList = fd;

    Object.keys(nValue).forEach((key) => {
      fd.append(key, nValue[key]);
    });

    const action = {
      StateName: 'StateName', types: ['Loading', 'Success', 'Fail'], Condition: userInfo,
      promise: (client) => client.post(client.API.Common.AddUser, { data: fd }),
    };
    const __self = this;
    return this.Client({ action }).then((result) => {

      return result;
    });
  }

  /**
   * 用户列表
   * 
   * @param {*} cnd 
   * @returns {Promise<any>} 
   * @memberof UserInfoService
   */
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

  /**
   * 删除用户操作
   * 
   * @param {*} item 
   * @returns {Promise<any>} 
   * @memberof UserInfoService
   */
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