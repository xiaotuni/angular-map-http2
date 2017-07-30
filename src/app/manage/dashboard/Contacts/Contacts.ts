import { Component } from '@angular/core';
import { Utility, routeAnimation, BaseComponent } from '../../Core';

@Component({
  moduleId: module.id,
  selector: 'app-manage-Dashboard-contacts',
  templateUrl: 'Contacts.html',
  styleUrls: ['./Contacts.scss'],
  animations: [routeAnimation],
})
export class Contacts extends BaseComponent {

  constructor() {
    super();
  }
}