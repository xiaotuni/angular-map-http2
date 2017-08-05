export class BaiduMapService {
  private ApiClient: any;
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