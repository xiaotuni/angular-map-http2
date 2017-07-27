import { Injectable } from '@angular/core';
import { Client } from './Core';
import { ApiManagerService } from './ApiManager';
import { DemoService } from './Demo';
import { UserInfoService } from './UserInfo';

@Injectable()
export class ServiceHelper {
  public ApiManager: ApiManagerService;
  public DemoService: DemoService;
  public UserInfo: UserInfoService;
  constructor() {
    this.ApiManager = new ApiManagerService(Client);
    this.UserInfo = new UserInfoService(Client);
    this.DemoService = new DemoService(Client);
  }


}