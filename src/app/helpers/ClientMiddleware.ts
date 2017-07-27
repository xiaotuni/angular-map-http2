export default function ClientMiddleware(client) {

  /**
   * 批处理操作
   * 
   * @param {any} args 
   * @returns 
   */
  const __BatchCallAPI = (args) => {
    const { commit, actions } = args;
    const { loading, fail, complete, list } = actions;
    const __APIList = [];
    list.forEach((item) => {
      const { promise } = item;
      __APIList.push(promise(client));
    });
    return Promise.all(__APIList).then((results) => results, (err) => err).catch((error) => error);
  };

  /**
   * 方法调用
   * 
   * @param {any} args 
   * @returns 
   */
  const __CallMethod = (args) => {
    const { dispatch, commit, state, action, actions } = args;
    // 判断是否是批量调用接口
    if (actions) {
      return __BatchCallAPI(args);
    }
    if (typeof action === 'function') {
      return action(dispatch, state);
    }
    const { promise, type, ...rest } = action;

    return new Promise((resolve, reject) => {
      promise(client).then((result) => {
        resolve(result);
      }, (error) => {
        reject(error);
      }).catch((error) => error);
    });
  };
  return __CallMethod;
}
