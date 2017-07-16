import { ApiListComponent } from './apilist/apilist';


const __Router = { ApiListComponent };
const __Keys = Object.keys(__Router);

const __PageList = [];
__Keys.forEach((key) => {
  __PageList.push(__Router[key]);
});

export const ManagerApiRouterComponent = __Router;
export const ManagerApiPageComponentList = __PageList;