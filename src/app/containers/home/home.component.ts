import { Component, OnInit } from '@angular/core';
import { Utility, Client } from '../Core';
import { routeAnimation } from '../app.animations';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routeAnimation]
})
export class HomeComponent extends BaseComponent implements OnInit {

  public DataList: Array<any>;

  ngOnInit() {
    setTimeout(() => {
      // this.__CallApi();
    }, 2000);
  }

  __CallApi() {
    const __params = { parentId: 10000000, pageIndex: 0, pageSize: 10 };
    const __List = { actions: { list: [], loading: 'Load', fail: 'Fail', complete: 'Complete', } };
    __List.actions.list.push({
      StateName: 'StateName',
      promise: (client) => client.get(client.API.Common.Organization, { params: __params, data: __params }),
      Condition: __params
    });
    // __List.actions.list.push({
    //   StateName: 'StateName',
    //   promise: (client) => client.get(client.API.Common.Organization, { params: __params1, data: {} }),
    //   Condition: __params1
    // });
    const __self = this;
    Client(__List).then((result) => {
      __self.DataList = result && result[0] ? result[0] : [];
      console.log(JSON.stringify(__self.DataList));
    });
  }
}
