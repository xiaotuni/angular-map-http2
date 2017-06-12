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


  ngOnInit() {
  }

  __CallApi() {
    const __params = { parentId: 10000000, pageIndex: 0, pageSize: 10 };
    const __List = { actions: { list: [], loading: 'Load', fail: 'Fail', complete: 'Complete', } };
    __List.actions.list.push({
      StateName: 'StateName', promise: (client) => client.get(client.API.Common.Organization, { params: __params, data: __params }),
      Condition: __params
    });
    Client(__List).then((result) => {
      console.log(result);
    });
  }
}
