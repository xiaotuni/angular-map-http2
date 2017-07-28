import { Injectable } from '@angular/core';
import { Client } from './Core';
import { ApiManagerService } from './ApiManager';
import { DemoService } from './Demo';
import { UserInfoService } from './UserInfo';
import { CommonService } from './CommonService';

@Injectable()
export class ServiceHelper {
  public ApiManager: ApiManagerService;
  public DemoService: DemoService;
  public UserInfo: UserInfoService;
  public Common: CommonService;
  constructor() {
    this.ApiManager = new ApiManagerService(Client);
    this.UserInfo = new UserInfoService(Client);
    this.DemoService = new DemoService(Client);
    this.Common = new CommonService();
  }


}