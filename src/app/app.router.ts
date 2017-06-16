import { RouterModule } from '@angular/router';
import { RouterComponent } from './containers/Core';
import { ManagerRouterComponent } from './managers/Core';
export const AppRouting = {
  Router() {
    const {
      BaiduMapComponent,
      ProductComponent, MembersComponent, MyComponentComponent, NotFoundComponent, HomeComponent
     } = RouterComponent;
    const { LoginComponent, DashboardComponent } = ManagerRouterComponent;
    const routes = [
      { path: '', redirectTo: 'home', pathMatch: 'full', data: { title: '首页' } },
      { path: 'home', component: HomeComponent, data: { title: '首页' } },
      { path: 'member', component: MembersComponent, data: { title: '成员列表' } },
      { path: 'product', component: ProductComponent, data: { title: '产品信息' } },
      { path: 'mycomponent', component: MyComponentComponent, data: { title: '我的组件' } },
      { path: 'baidumap', component: BaiduMapComponent, data: { title: '百度地图' } },

      {
        path: 'manager', data: { title: '用户登录' },
        children: [
          { path: 'login', component: LoginComponent, data: { title: '用户登录' } },
          { path: 'dashboard', component: DashboardComponent, data: { title: '控制面板' } },
        ]
      },


      { path: '**', component: NotFoundComponent, data: { title: '404页面未找到' } }
    ];
    return RouterModule.forRoot(routes, { useHash: !true });
  },
}
