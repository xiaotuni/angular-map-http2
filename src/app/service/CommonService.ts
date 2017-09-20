export class CommonService {

  public CurrentRouterQueryParams: any;
  public CurrentRouterPathInfo: any;
  private ApiClient: any;
  AreaInfo: any;
  CaptchaInfo: any;

  constructor(private client) {
    this.ApiClient = client;
  }

  GetArea(condition): Promise<any> {
    const __self = this;
    const options = {
      action: {
        promise: (client) => client.get(client.API.Common.Area, { params: condition || { PageIndex: 0, PageSize: 10 } }),
        types: ['Loading', 'Success', 'Fail']
      },
    };
    const { PageIndex, PageSize } = condition || { PageIndex: 0, PageSize: 10 };
    return this.ApiClient(options).then((data) => {
      const { List, Condition } = data;
      if (PageIndex === 0) {
        __self.AreaInfo = data;
      } else {
        __self.AreaInfo.List = __self.AreaInfo.List.concat(List)
        __self.AreaInfo.Condition = Condition;
      }
      return data;
    });
  }

  GetCaptcha(): Promise<any> {
    const self = this;
    const options = { action: { promise: (client) => client.get(client.API.Common.Captcha, {}) } };
    return this.ApiClient(options).then((success) => {
      self.CaptchaInfo = success;
      return success;
    });
  }

  FileUpload(file): Promise<any> {
    const self = this;
    const options = { action: { promise: (client) => client.post(client.API.Common.FileUpload, { data: file }) } };
    return this.ApiClient(options).then((success) => {
      self.CaptchaInfo = success;
      return success;
    });
  }

  FilesUpload(files): Promise<any> {
    const self = this;
    const options = { action: { promise: (client) => client.post(client.API.Common.FilesUpload, { data: files }) } };
    return this.ApiClient(options).then((success) => {
      self.CaptchaInfo = success;
      return success;
    });
  }


  CallOtherApi() {
    const self = this;
    const options = { action: { promise: (client) => client.post(client.API.Common.CallThirdPartyApi, { data: { id: 1, name: '1234' } }) } };
    return this.ApiClient(options).then((success) => {
      self.CaptchaInfo = success;
      return success;
    });
  }
}