import { Component, OnInit } from '@angular/core';
import { routeAnimation } from '../app.animations';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css'],
  animations: [routeAnimation]
})
export class MyComponentComponent extends BaseComponent implements OnInit {
  title = "page 3";

  ngOnInit(): void {

  }
}
