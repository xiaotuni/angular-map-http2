import { LoginComponent } from './login/Login';
import { DashboardComponent } from './Dashboard/Dashboard';
import { RegisterComponent } from './register/register';

const __Router = { LoginComponent, RegisterComponent, DashboardComponent };
const __Keys = Object.keys(__Router);

const __PageList = [];
__Keys.forEach((key) => {
  __PageList.push(__Router[key]);
});

export const ManagerRouterComponent = __Router;
export const ManagerPageComponentList = __PageList;