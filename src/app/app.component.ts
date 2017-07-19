import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RoutesRecognized, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Utility } from './containers/Core';
import { EventEmitter } from 'events';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  __Title111 = 'app works!';
  private __Location: Location;

  constructor(private router: Router, private location: Location, private activatedRoute: ActivatedRoute,
    private titleService: Title) {
    this.__Location = location;
    this.__RouterListen(router);
    this.__ListenEmit();
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
        const firstChild = _FindFirstChild(root.firstChild);
        const routeConfig = firstChild.routeConfig;
        const { path, data } = routeConfig;
        const { title } = data || { title: '空' };
        this.titleService.setTitle(title);
        __self.__Title111 = title;
        // console.log(path, queryParams);
      }
    });

    window.onpopstate = (a) => {
      // console.log('pop');
      // const __key = Utility.$ConstItem.AppIsGoBack;
      // Utility.$SetContent(__key, true, false);;
      // setTimeout(() => {
      //   Utility.$RemoveContent(__key, false);
      // }, 650);
    };
    // router.events.changes(() => { });
    // router.subscribe((item) => { });
  }

  __GoBack() {
    Utility.$GoBack();
  }

  __ListenEmit() {
    const { HttpStatus } = Utility.$ConstItem.Events;
    Utility.$On(HttpStatus[400], (args) => {
      console.log(args);
    });
  }
}
