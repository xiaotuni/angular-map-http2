import { Component, OnInit } from '@angular/core';
import { BaseComponent, Utility, routeAnimation } from '../Core';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  animations: [routeAnimation]
})
export class Members extends BaseComponent implements OnInit {
  title = "成员组件";


  ngOnInit(): void {

  }
}
