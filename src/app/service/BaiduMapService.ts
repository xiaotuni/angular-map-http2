export class BaiduMapService {

  private ApiClient: any;
  Status: any = {
    BMAP_STATUS_SUCCESS: { name: '检索成功', value: 0 },
    BMAP_STATUS_CITY_LIST: { name: '城市列表', value: 1 },
    BMAP_STATUS_UNKNOWN_LOCATION: { name: '位置结果未知', value: 2 },
    BMAP_STATUS_UNKNOWN_ROUTE: { name: '导航结果未知', value: 3 },
    BMAP_STATUS_INVALID_KEY: { name: '非法密钥', value: 4 },
    BMAP_STATUS_INVALID_REQUEST: { name: '非法请求', value: 5 },
    BMAP_STATUS_PERMISSION_DENIED: { name: '没有权限', value: 6 },
    BMAP_STATUS_SERVICE_UNAVAILABLE: { name: '服务不可用', value: 7 },
    BMAP_STATUS_TIMEOUT: { name: '超时', value: 8 },
  }
  /**
   * 当前要查看的活动信息
   * 
   * @type {*}
   * @memberof BaiduMapService
   */
  public CurrentPlaceInfo: any;
  /**
   * 我的活动列表
   * 
   * @type {*}
   * @memberof BaiduMapService
   */
  public PlaceListInfo: any;

  constructor(private client) {
    this.ApiClient = client;
  }

  AddPlace(placeInfo): Promise<any> {
    const OldPI = JSON.parse(JSON.stringify(placeInfo));
    OldPI.BeginDate = OldPI.BeginTime;
    OldPI.EndDate = OldPI.EndTime;
    OldPI.BeginDate = parseInt(OldPI.BeginDate, 0);
    OldPI.EndDate = parseInt(OldPI.EndDate, 0);
    if (!OldPI.Bewrite || OldPI.Bewrite === '') {
      OldPI.Bewrite = OldPI.Address;
    }
    delete OldPI.BeginTime;
    delete OldPI.EndTime;

    const __self = this;
    const options = {
      action: {
        types: ['Loading', 'Success', 'Fail'],
        promise: (client) => client.post(client.API.Map.AddPlace, { data: OldPI }),
      },
    };
    return this.ApiClient(options).then((data) => {
      return data;
    });
  }

  MyPlaceList(Condition: any): Promise<any> {
    const { PageSize, PageIndex } = Condition;
    const __self = this;
    const options = {
      action: {
        types: ['Loading', 'Success', 'Fail'], promise: (client) => client.get(client.API.Map.MyPlaceList, { params: Condition || {} }),
      },
    };

    return this.ApiClient(options).then((data) => {
      const { List, Condition } = data;
      const { PlaceListInfo } = __self;
      if (!__self.PlaceListInfo || PageIndex === 0) {
        __self.PlaceListInfo = data;
      } else {
        __self.PlaceListInfo.List = __self.PlaceListInfo.List.concat(List)
        __self.PlaceListInfo.Condition = Condition;
      }

      return data;
    });
  }

  JoinPlace(InviteCode): Promise<any> {
    const __self = this;
    const options = {
      action: {
        types: ['Loading', 'Success', 'Fail'],
        promise: (client) => client.post(client.API.Map.JoinPlace, { data: { InviteCode } }),
      },
    };
    return this.ApiClient(options).then((data) => {
      return data;
    });
  }
}