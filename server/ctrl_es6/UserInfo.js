/**
 * 用户信息类
 * 
 * @class UserInfo
 */
class UserInfo {
  constructor(DbHelper, Utility) {
    this.DbHelper = DbHelper;
    this.Utility = Utility;
  }

  /**
   * 
   * 
   * @param {any} request 
   * @param {any} response 
   * @param {any} options 
   * @memberof UserInfo
   */
  post_login(request, response, options) {

  }

  get_user(request, response, options) {
    response.Send({ msg: '这是一个get请求', options });
  }

  post_user(request, response, options) {
    response.Send({ msg: '这是一个 post 请求', options });
  }

  delete_user(request, response, options) {
    response.Send({ msg: '这是一个 delete 请求', options });
  }

  put_user(request, response, options) {
    response.Send({ msg: '这是一个 put 请求', options });
  }
}

module.exports = UserInfo;


//  get_users(request, response, options) {
//     this.DbHelper.Query('select * from xtn_userinfo', (data) => {
//       const { result } = data || {};
//       response.Send(result);
//     }, () => { });
//   }

//   get_userdetail(request, response, options) {
//     const { id } = options || {};
//     if (!id) {
//       response.SendError({ status: 400, code: 10000, msg: '用户ID没有传.' });
//       return;
//     }
//     const sql = this.Utility.Comm.format('select * from xtn_userinfo t where t.id = {0}', id)
//     this.DbHelper.QueryOne(sql, (data) => {
//       const { result } = data || {};
//       response.Send(result);
//     }, (err) => {
//       response.Send_500({ status: 500, msg: err });
//     });
//   }

//   /**
//    * 获取用户
//    * 
//    * @param {any} request 
//    * @param {any} response 
//    * @memberof UserInfo
//    */
//   get_user(request, response, options) {
//     this.DbHelper.QueryOne('select * from xtn_userinfo', (data) => {
//       const { result } = data || {};
//       response.Send(result);
//     }, (err) => {
//       response.Send_500({ status: 500, msg: err });
//     });
//   }

//   /**
//    * 保存用户
//    * 
//    * @param {any} request 
//    * @param {any} response 
//    * @memberof UserInfo
//    */
//   post_user(request, response, options) {
//     console.log(options);
//     const { data } = options;
//     response.Send('ok');
//   }

//   post_test(request, response, options) {
//     this.DbHelper.InsertSQL('xtn_userinfo', options.data, (data) => {
//       console.log(JSON.stringify(data));
//       response.Send({ msg: 'ok' });
//     }, (err) => {
//       response.Send_500({ status: 500, msg: err });
//     })
//   }

//   /**
//    * 删除用户
//    * 
//    * @param {any} request 
//    * @param {any} response 
//    * @memberof UserInfo
//    */
//   delete_user(request, response, options) {
//     this.DbHelper.DeleteSQL('xtn_userinfo', options, (data) => {
//       response.Send({ msg: 'ok' });
//     }, (err) => {
//       response.Send_500({ status: 500, msg: err });
//     });
//   }

//   /**
//    * 修改用户信息
//    * 
//    * @param {any} request 
//    * @param {any} response 
//    * @memberof UserInfo
//    */
//   put_user(request, response, options) {

//   }