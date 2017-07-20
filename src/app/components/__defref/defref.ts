import { Component, OnInit } from '@angular/core';
import { Utility } from '../ComponentTools';

@Component({
  moduleId: module.id,
  selector: 'xtn-defref',
  templateUrl: 'defref.html',
  styleUrls: ['./defref.scss']
})
export class __DefRefComponent implements OnInit {
  collection: Array<any> = new Array<any>();
  constructor() { }

  ngOnInit() {
    const { UrlTitle } = Utility.$ConstItem;
    const __list = [];
    Object.keys(UrlTitle).forEach((key) => {
      __list.push(Object.assign({}, { key }, UrlTitle[key]));
    });
    this.collection = __list;
  }

  __GoToPage(item) {
    Utility.$ToPage(item.key, {});
  }
}