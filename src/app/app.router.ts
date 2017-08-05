import { RouterModule } from '@angular/router';
import { RouterComponent } from './containers/Index';
import { ManagerRouter } from './manage/Index';
import { ManagerApiRouter } from './manageapi/Index';
export const AppRouting = {
  Router() {
    const { BaiduMap, BaiduMyJoinPlace, BaiduMyPlaceList, Product, Members, MyComponent, NotFound, Home } = RouterComponent;
    const { Login, UserList, Register, Dashboard,
      Address, Place, PlaceList, Contacts } = ManagerRouter;
    const { ApiList } = ManagerApiRouter;
    const routes = [
      { path: '', redirectTo: 'home', pathMatch: 'full', data: { title: '首页' } },
      { path: 'home', component: Home, data: { title: '首页' } },
      { path: 'member', component: Members, data: { title: '成员列表' } },
      { path: 'product', component: Product, data: { title: '产品信息' } },
      { path: 'mycomponent', component: MyComponent, data: { title: '我的组件' } },
      {
        path: 'baidumap', data: { title: '地图' },
        children: [
          { path: '', component: BaiduMap, data: { title: '地图' } },
          { path: 'myplace', component: BaiduMyPlaceList, data: { title: '我发起的活动' } },
          { path: 'myjoinplace', component: BaiduMyJoinPlace, data: { title: '我要加入' } },
        ]
      },
      {
        path: 'manager', data: { title: '用户登录' },
        children: [
          { path: 'register', component: Register, data: { title: '用户注册' } },
          { path: 'login', component: Login, data: { title: '用户登录' } },
          { path: 'userlist', component: UserList, data: { title: '用户列表' } },
          { path: 'dashboard', component: Dashboard, data: { title: '控制面板' } },
          { path: 'address', component: Address, data: { title: '我的地址' } },
          {
            path: 'place', data: { title: '目的地' },
            children: [
              { path: '', component: Place, data: { title: '目的地1' } },
              { path: 'list', component: PlaceList, data: { title: '目的地列表' } },
            ]
          },
          { path: 'contacts', component: Contacts, data: { title: '联系人' } },
        ]
      },
      {
        path: 'api', data: { title: '后台API管理' },
        children: [
          { path: 'list', component: ApiList, data: { title: 'Api列表' } },
        ]
      },

      { path: '**', component: NotFound, data: { title: '404页面未找到' } }
    ];
    return RouterModule.forRoot(routes, { useHash: !true });
  },
}
