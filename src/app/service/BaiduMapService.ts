export class BaiduMapService {
  private ApiClient: any;

  constructor(private client) {
    this.ApiClient = client;
  }

  AddPlace(placeInfo): Promise<any> {
    const __self = this;
    const options = {
      action: {
        promise: (client) => client.post(client.API.Map.AddPlace, { data: placeInfo }),
        types: ['Loading', 'Success', 'Fail']
      },
    };
    return this.ApiClient(options).then((data) => {
      return data;
    });
  }
}