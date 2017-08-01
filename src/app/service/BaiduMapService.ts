export class BaiduMapService {
  private ApiClient: any;

  constructor(private client) {
    this.ApiClient = client;
  }

  AddPlace(placeInfo): Promise<any> {
    const OldPI = JSON.parse(JSON.stringify(placeInfo));
    OldPI.BeginDate = OldPI.BeginTime / 1000;
    OldPI.EndDate = OldPI.EndTime / 1000;
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

  MyPlaceList(): Promise<any> {
    const __self = this;
    const options = {
      action: {
        types: ['Loading', 'Success', 'Fail'],
        promise: (client) => client.get(client.API.Map.MyPlaceList, {}),
      },
    };
    return this.ApiClient(options).then((data) => {
      console.log(data);
      return data;
    });
  }
}