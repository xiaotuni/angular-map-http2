import { Component } from '@angular/core';
import { Utility, routeAnimation, BaseComponent } from '../Core';

@Component({
  moduleId: module.id,
  selector: 'app-manage-Dashboard',
  templateUrl: 'Dashboard.html',
  styleUrls: ['./Dashboard.scss'],
  animations: [routeAnimation],
})
export class Dashboard extends BaseComponent {

  constructor() {
    super();
  }
}