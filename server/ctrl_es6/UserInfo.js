/**
 * 用户信息类
 * 
 * @class UserInfo
 */
class UserInfo {
  constructor() {
  }
  get_users(DbHelper, request, response, options) {
    DbHelper.Query('select * from xtn_userinfo', (data) => {
      const { result } = data || {};
      response.Send(result);
    }, () => { });
  }

  /**
   * 获取用户
   * 
   * @param {any} request 
   * @param {any} response 
   * @memberof UserInfo
   */
  get_user(DbHelper, request, response, options) {
    DbHelper.QueryOne('select * from xtn_userinfo', (data) => {
      const { result } = data || {};
      response.Send(result);
    }, () => { });
  }

  /**
   * 保存用户
   * 
   * @param {any} request 
   * @param {any} response 
   * @memberof UserInfo
   */
  post_user(request, response, options) {

  }

  /**
   * 删除用户
   * 
   * @param {any} request 
   * @param {any} response 
   * @memberof UserInfo
   */
  delete_user(request, response, options) {

  }

  /**
   * 修改用户信息
   * 
   * @param {any} request 
   * @param {any} response 
   * @memberof UserInfo
   */
  put_user(request, response, options) {

  }
}

module.exports = UserInfo;