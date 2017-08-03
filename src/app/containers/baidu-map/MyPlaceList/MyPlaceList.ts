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

  PlaceList: any;

  constructor(private sHelper: ServiceHelper) {
    super();
  }

  ngOnInit() {
    this.__InitMyPlacePlist();
  }

  __InitMyPlacePlist() {

    const self = this;
    this.sHelper.BaiduMap.MyPlaceList({ PageIndex: 0, PageSize: 10 }).then(() => {
      self.PlaceList = self.sHelper.BaiduMap.PlaceListInfo;
    }, () => {

    });

  }

  onBtnQuery() {
    this.__InitMyPlacePlist();
  }

  onClickToMap(item) {
    if (!item) {
      return;
    }
    const { Name, Longitude, Latitude } = item;
    Utility.$ToPage(Utility.$ConstItem.UrlItem.BaiduMap, { Name, Longitude, Latitude });
  }
}
