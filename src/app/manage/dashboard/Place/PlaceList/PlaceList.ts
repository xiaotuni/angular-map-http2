import { Component } from '@angular/core';
import { Utility, routeAnimation, BaseComponent } from '../../../Core';

@Component({
  moduleId: module.id,
  selector: 'app-manage-Dashboard-place-list',
  templateUrl: 'PlaceList.html',
  styleUrls: ['./PlaceList.scss'],
  animations: [routeAnimation],
})
export class PlaceList extends BaseComponent {

  constructor() {
    super();
  }
}