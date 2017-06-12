import { Component, OnInit } from '@angular/core';
import { routeAnimation } from '../app.animations';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  animations: [routeAnimation]
})
export class ProductComponent extends BaseComponent implements OnInit {

  title = "page 2";

  ngOnInit(): void {
  
  }
}
