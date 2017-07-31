import { Injectable } from '@angular/core';
import { Client } from './Core';
import { ApiManagerService } from './ApiManager';
import { DemoService } from './Demo';
import { UserInfoService } from './UserInfo';
import { CommonService } from './CommonService';
import { BaiduMapService } from './BaiduMapService';

@Injectable()
export class ServiceHelper {
  public ApiManager: ApiManagerService;
  public DemoService: DemoService;
  public UserInfo: UserInfoService;
  public Common: CommonService;
  public BaiduMap: BaiduMapService;
  constructor() {
    this.ApiManager = new ApiManagerService(Client);
    this.UserInfo = new UserInfoService(Client);
    this.DemoService = new DemoService(Client);
    this.BaiduMap = new BaiduMapService(Client);
    this.Common = new CommonService();
  }


}