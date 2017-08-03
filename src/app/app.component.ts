import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RoutesRecognized, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Utility } from './containers/Core';
import { ServiceHelper } from './service/index'
import { EventEmitter } from 'events';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ServiceHelper]
})
export class AppComponent {
  __Title111 = 'app works!';
  private __Location: Location;
  public ActionSheetInfo: any;
  public ActionSheetList: Array<any> = new Array();
  public DialogList: Array<any> = new Array();

  constructor(private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private sHelper: ServiceHelper) {
    this.__Location = location;
    this.__RouterListen(router);
    this.__ListenEmit(this);
  }

  __RouterListen(router: Router): void {
    Utility.$SetContent(Utility.$ConstItem.Route, router, false);
    Utility.$SetContent(Utility.$ConstItem.BrowerTitle, this.titleService, false);
    Utility.$SetContent(Utility.$ConstItem.Location, this.__Location, false);
    Utility.$SetContent(Utility.$ConstItem.Event, new EventEmitter(), false);

    const _FindFirstChild = (parent) => {
      //
      const { firstChild } = parent;
      if (firstChild) {
        return _FindFirstChild(firstChild);
      }
      return parent;
    };
    const __self = this;
    router.events.subscribe((obj: any) => {
      if (obj instanceof RoutesRecognized) {
        const state = obj.state;
        const root = state.root;
        const queryParams = root.queryParams;
        // __self.sHelper.Common.CurrentRouterPathInfo = { queryParams, Url: obj.url };
        Utility.$SetContent(Utility.$ConstItem.UrlPathInfo, { Params: queryParams, Url: obj.url }, false);
        const firstChild = _FindFirstChild(root.firstChild);
        const routeConfig = firstChild.routeConfig;
        const { path, data } = routeConfig;
        const { title } = data || { title: '空' };
        this.titleService.setTitle(title);
        __self.__Title111 = title;
      }
    });

  }

  __GoBack() {
    Utility.$GoBack();
  }

  __ListenEmit(_this) {
    const { ShowModel, HttpStatus } = Utility.$ConstItem.Events;
    Utility.$On(HttpStatus[400], (args) => {
      Utility.$Emit(ShowModel.onActionSheet, args);
    });
    Utility.$On(HttpStatus[401], (args) => {
      const _a = _this;
      const ToPage = { Url: Utility.$ConstItem.UrlItem.ManagerLogin, Params: { IsGoBack: 1 } };
      Utility.$Emit(ShowModel.onActionSheet, Object.assign(args, { ToPage }));
    });
    Utility.$On(HttpStatus[404], (args) => {
      Utility.$Emit(ShowModel.onActionSheet, args);
    });
    Utility.$On(HttpStatus[500], (args) => {
      Utility.$Emit(ShowModel.onActionSheet, args);
    });
    Utility.$On(ShowModel.onActionSheet, (args) => {
      _this.ActionSheetList.push(args);
    });
    Utility.$On(ShowModel.onActionSheetHide, (index) => {
      if (index >= 0) {
        _this.ActionSheetList[index].IsClose = true;
      }
      setTimeout(() => {
        if (index >= 0) {
          _this.ActionSheetList.splice(index, 1);
        } else {
          _this.ActionSheetList.pop();
        }
      }, 100);
    });

    Utility.$On(ShowModel.onDialog, (args) => {
      _this.DialogList.push(args);
    });
    Utility.$On(ShowModel.onDialogHide, (index) => {
      if (index >= 0) {
        _this.DialogList[index].IsClose = true;
      }
      setTimeout(() => {
        if (index >= 0) {
          _this.DialogList.splice(index, 1);
        } else {
          _this.DialogList.pop();
        }
      }, 200);
    });
  }
}
