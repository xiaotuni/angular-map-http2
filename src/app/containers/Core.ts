export { Utility } from '../Common/Utility';
export { CommonComponent } from '../components/Core'
export { ServiceHelper } from '../manage/Core'
export { Client } from '../helpers/Core';

import { MyComponent } from './my-component/my-component.component';
import { Product } from './product/product.component';
import { Members } from './members/members.component';
import { NotFound } from './not-found/not-found.component';
import { Home } from './home/home.component';
import { BaiduMap } from './baidu-map/baidu-map';
import { BaiduMapMarker } from './baidu-map/marker/marker';

const __Router = { BaiduMap, Home, MyComponent, Members, Product, NotFound };
const __Keys = Object.keys(__Router);

const __PageList = [];
__Keys.forEach((key) => {
  __PageList.push(__Router[key]);
});
__PageList.push(BaiduMapMarker);

export const RouterComponent = __Router;
export const PageComponentList = __PageList;