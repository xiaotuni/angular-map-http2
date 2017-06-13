import { RouterModule } from '@angular/router';
import { RouterComponent } from './containers/Core';
export const AppRouting = {
  Router() {
    const {
      BaiduMapComponent,
      ProductComponent, MembersComponent, MyComponentComponent, NotFoundComponent, HomeComponent
     } = RouterComponent;
    const routes = [
      { path: '', redirectTo: 'home', pathMatch: 'full', data: { title: '首页' } },
      { path: 'home', component: HomeComponent, data: { title: '首页' } },
      { path: 'member', component: MembersComponent, data: { title: '成员列表' } },
      { path: 'product', component: ProductComponent, data: { title: '产品信息' } },
      { path: 'mycomponent', component: MyComponentComponent, data: { title: '我的组件' } },
      { path: 'baidumap', component: BaiduMapComponent, data: { title: '百度地图' } },
      { path: '**', component: NotFoundComponent, data: { title: '404页面未找到' } }
    ];
    return RouterModule.forRoot(routes, { useHash: !true });
  },
}


// export const AppRouting = RouterModule.forRoot([
//   { path: '', redirectTo: 'home', pathMatch: 'full', data: { title: '首页' } },
//   { path: 'home', component: HomeComponent, data: { title: '首页' } },
//   { path: 'member', component: MembersComponent, data: { title: '成员列表' } },
//   { path: 'product', component: ProductComponent, data: { title: '产品信息' } },
//   { path: 'mycomponent', component: MyComponentComponent, data: { title: '我的组件' } },
//   { path: '**', component: NotFoundComponent, data: { title: '404页面未找到' } }
// ], { useHash: !true });


// export const AppRouting = RouterModule.forRoot(routes, { useHash: true });