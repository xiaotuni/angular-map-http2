import { Component } from '@angular/core';
import { Utility, routeAnimation, BaseComponent } from '../../Core';

@Component({
  moduleId: module.id,
  selector: 'app-manage-Dashboard-place',
  templateUrl: 'Place.html',
  styleUrls: ['./Place.scss'],
  animations: [routeAnimation],
})
export class Place extends BaseComponent {

  constructor() {
    super();
  }
}