import { Component, OnInit } from '@angular/core';
import { Utility, ServiceHelper, routeAnimation, BaseComponent } from '../../Core';


@Component({
  selector: 'app-baidu-map-my-join-place',
  templateUrl: 'MyJoinPlace.html',
  styleUrls: ['./MyJoinPlace.scss'],
  animations: [routeAnimation],
  providers: [ServiceHelper]
})
export class BaiduMyJoinPlace extends BaseComponent implements OnInit {

  InviteCode: any;

  constructor(private sHelper: ServiceHelper) {
    super();
  }

  ngOnInit() {

  }

  onClickOk() {
    console.log(this.InviteCode);
    if (!this.InviteCode || this.InviteCode === '') {
      Utility.$ShowMessage('参加活动', '请输入你的邀请码？');
      return;
    }
    this.sHelper.BaiduMap.JoinPlace(this.InviteCode).then(() => { }, () => { });
  }
}
