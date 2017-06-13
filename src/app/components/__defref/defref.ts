import { Component, OnInit } from '@angular/core';
import { Utility } from '../Core';

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
    console.log('__DefRefComponent');
    const { UrlTitle } = Utility.$ConstItem;
    const __list = [];
    Object.keys(UrlTitle).forEach((key) => {
      __list.push(Object.assign({}, { key }, UrlTitle[key]));
    });
    this.collection = __list;
  }

  __GoToPage(item) {
    console.log(item);
    Utility.$ToPage(item.key, {});
  }
}