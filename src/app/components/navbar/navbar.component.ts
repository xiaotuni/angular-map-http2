import { Component, OnInit, Output, Input } from '@angular/core';
import { Utility } from '../../Common/Utility';
@Component({
  selector: 'xtn-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input('Title') __Title: string;

  constructor() { }

  ngOnInit() {
  }

  __GoBack() {
    Utility.$GoBack();
  }
}
