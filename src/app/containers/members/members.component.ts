import { Component, OnInit } from '@angular/core';
import { Utility } from '../Core';
import { routeAnimation } from '../app.animations';
import { BaseComponent } from '../base.component';


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
