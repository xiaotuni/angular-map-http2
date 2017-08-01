import { Component, OnInit } from '@angular/core';
import { BaseComponent, Utility, routeAnimation } from '../Core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations: [routeAnimation]
})
export class Product extends BaseComponent implements OnInit {

  title = "page 2";

  ngOnInit(): void {
  
  }
}
