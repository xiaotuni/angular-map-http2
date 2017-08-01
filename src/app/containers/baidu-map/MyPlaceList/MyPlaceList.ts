import { Component, OnInit } from '@angular/core';
import { Utility, ServiceHelper, routeAnimation, BaseComponent } from '../../Core';


@Component({
  selector: 'app-baidu-map-place-list',
  templateUrl: 'MyPlaceList.html',
  styleUrls: ['./MyPlaceList.scss'],
  animations: [routeAnimation],
  providers: [ServiceHelper]
})
export class BaiduMyPlaceList extends BaseComponent implements OnInit {

  PlaceList: Array<any>;

  constructor(private sHelper: ServiceHelper) {
    super();
  }

  ngOnInit() {
    this.__InitMyPlacePlist();
  }

  __InitMyPlacePlist() {

  }


}
