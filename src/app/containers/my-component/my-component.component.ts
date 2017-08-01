import { Component, OnInit } from '@angular/core';
import { BaseComponent, Utility, routeAnimation } from '../Core';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss'],
  animations: [routeAnimation]
})
export class MyComponent extends BaseComponent implements OnInit {
  title = "page 3";

  ngOnInit(): void {

  }
}
