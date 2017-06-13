export { Utility } from '../Common/Utility';
export { CommonComponent } from '../components/Core'
// 访问接口
import ApiClient from '../helpers/ApiClient';
import clientMiddleware from '../helpers/clientMiddleware';
export const Client = clientMiddleware(new ApiClient(null));

import { MyComponentComponent } from './my-component/my-component.component';
import { ProductComponent } from './product/product.component';
import { MembersComponent } from './members/members.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { BaiduMapComponent } from './baidu-map/baidu-map';

const __Router = { BaiduMapComponent, HomeComponent, MyComponentComponent, MembersComponent, ProductComponent, NotFoundComponent };
const __Keys = Object.keys(__Router);

const __PageList = [];
__Keys.forEach((key) => {
  __PageList.push(__Router[key]);
});

export const RouterComponent = __Router;
export const PageComponentList = __PageList;