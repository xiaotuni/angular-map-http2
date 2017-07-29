import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { RegisterComponent } from './register/register';
import { UserListComponent } from './userlist/userlist';

const __Router = { LoginComponent, UserListComponent, RegisterComponent, DashboardComponent };
const __Keys = Object.keys(__Router);

const __PageList = [];
__Keys.forEach((key) => {
  __PageList.push(__Router[key]);
});

export const ManagerRouterComponent = __Router;
export const ManagerPageComponentList = __PageList;