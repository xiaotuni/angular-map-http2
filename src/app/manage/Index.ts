import { Login } from './login/login';
import { Register } from './register/register';
import { UserList } from './userlist/userlist';
import { Dashboard, Address, Places, Contacts } from './dashboard/Index';

const __Router = { Address, ...Places, Contacts, Login, UserList, Register, Dashboard };
const __Keys = Object.keys(__Router);

const __PageList = [];
__Keys.forEach((key) => {
  __PageList.push(__Router[key]);
});

export const ManagerRouter = __Router;
export const ManagerPageComponentList = __PageList;