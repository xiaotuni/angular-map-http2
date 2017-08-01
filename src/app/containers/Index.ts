export { CommonComponent } from '../components/Index'

import { MyComponent } from './my-component/my-component.component';
import { Product } from './product/product.component';
import { Members } from './members/members.component';
import { NotFound } from './not-found/not-found.component';
import { Home } from './home/home.component';
import { BaiduMapPage } from './baidu-map/Index';

const __Router = { ...BaiduMapPage, Home, MyComponent, Members, Product, NotFound };
const __Keys = Object.keys(__Router);

const __PageList = [];
__Keys.forEach((key) => {
  __PageList.push(__Router[key]);
});

export const RouterComponent = __Router;
export const PageComponentList = __PageList;