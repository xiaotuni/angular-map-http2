import { ApiList } from './apilist/apilist';


const __Router = { ApiList };
const __Keys = Object.keys(__Router);

const __PageList = [];
__Keys.forEach((key) => {
  __PageList.push(__Router[key]);
});

export const ManagerApiRouter = __Router;
export const ManagerApiPageComponentList = __PageList;