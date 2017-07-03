export default function clientMiddleware(client) {
  const __BatchCallAPI = (args) => {
    const { commit, actions } = args;
    const { loading, fail, complete, list } = actions;
    const __APIList = [];
    list.forEach((item) => {
      const { promise } = item;
      __APIList.push(promise(client));
    });
    return Promise.all(__APIList).then((results) => {
      results.forEach((row, index) => {
        const { type, ...rest } = list[index];
      });
      return results;
    }).catch((error) => {
      console.log(error);
    });
  };

  const __CallMethod = (args) => {
    const { dispatch, commit, state, action, actions } = args;
    if (actions) {
      return __BatchCallAPI(args);
    }
    if (typeof action === 'function') {
      return action(dispatch, state);
    }
    const { promise, types, type, ...rest } = action;
    if (!promise) {
    }
    const [REQUEST, SUCCESS, FAILURE] = types;
    const actionPromise = promise(client);
    actionPromise.then((result) => {
    }, (error) => {
      console.log('------1--------');
    }).catch((error) => {
      console.log('------2--------');
    });

    return actionPromise;
  };
  return __CallMethod;
}
