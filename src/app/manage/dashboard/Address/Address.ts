import { Component } from '@angular/core';
import { Utility, routeAnimation, BaseComponent } from '../../Core';

@Component({
  moduleId: module.id,
  selector: 'app-manage-Dashboard-address',
  templateUrl: 'Address.html',
  styleUrls: ['./Address.scss'],
  animations: [routeAnimation],
})
export class Address extends BaseComponent {

  constructor() {
    super();
  }
}