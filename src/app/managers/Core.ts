export { Utility } from '../Common/Utility';
import { LoginComponent } from './login/Login';
import { DashboardComponent } from './Dashboard/Dashboard';

const __Router = { LoginComponent, DashboardComponent };
const __Keys = Object.keys(__Router);

const __PageList = [];
__Keys.forEach((key) => {
  __PageList.push(__Router[key]);
});

export const ManagerRouterComponent = __Router;
export const ManagerPageComponentList = __PageList;
