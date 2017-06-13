import { Component, OnInit, ElementRef, ViewChild, AfterContentInit } from '@angular/core';
import { Utility, Client } from '../Core';
import { routeAnimation } from '../app.animations';
import { BaseComponent } from '../base.component';


@Component({
  selector: 'app-baidu-map',
  templateUrl: 'baidu-map.html',
  styleUrls: ['baidu-map.scss'],
  animations: [routeAnimation]
})
export class BaiduMapComponent extends BaseComponent implements OnInit, AfterContentInit {
  @ViewChild('baidumapRef') baidumapRef: ElementRef;
  BMap: any;
  __Map: any;
  __CurrentPosition: any;
  __ZoomControl: Object = new Object();
  constructor(private el: ElementRef) {
    super();
  }

  __InitMap() {
    let __Interval;
    try {
      this.BMap = (<any>window)['BMap'];
      const __init = () => {
        this.__Map = new this.BMap.Map(this.baidumapRef.nativeElement);                 // 创建Map实例
        this.__Map.centerAndZoom(new this.BMap.Point(116.40387397, 39.91488908), 14);   // 初始化地图,设置中心点坐标和地图级别
        this.__Map.addControl(new this.BMap.MapTypeControl());                          //添加地图类型控件
        this.__Map.setCurrentCity("北京");                                              // 设置地图显示的城市 此项是必须设置的
        this.__Map.enableScrollWheelZoom(true);                                         //开启鼠标滚轮缩放
      };

      __Interval = setInterval(() => {
        this.BMap = (<any>window)['BMap'];
        if (this.BMap) {
          clearInterval(__Interval);
          __init();
        }
      }, 500);
    } catch (ex) {
      console.log(ex);
      if (__Interval) {
        clearInterval(__Interval);
      }
    }
  }

  ngOnInit() {
    this.__InitMap();
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.GetCurrentPosition();
    }, 1000);
  }

  GetCurrentPosition() {
    if (!this.BMap) {
      return;
    }
    const geolocation = new this.BMap.Geolocation();
    if (!geolocation) {
      return;
    }
    //关于状态码
    //BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
    //BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
    //BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
    //BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
    //BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
    //BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
    //BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
    //BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
    //BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)
    const self = this;
    geolocation.getCurrentPosition(function (result) {
      // latitude 纬度 ,longitude 经度
      const { BMAP_STATUS_SUCCESS } = <any>window
      if (this['getStatus']() === BMAP_STATUS_SUCCESS) {
        console.log(result);
        self.__CurrentPosition = result;
        const { point, address } = result;
        const { city } = address;
        self.__Map.panTo(point);          // 移动到当前定位的位置
        self.__Map.setCurrentCity(city);
      }
    }, { enableHighAccuracy: true });
  }

  NavigationControl() {
    if (!this.BMap || !this.__CurrentPosition) {
      return;
    }
    const { BMAP_NAVIGATION_CONTROL_SMALL } = <any>window
    this.__Map.addControl(new this.BMap.NavigationControl({ type: BMAP_NAVIGATION_CONTROL_SMALL }));    // 屏幕上的 + - 两个。
    this.__Map.addControl(new this.BMap.ScaleControl());                                                // 比例尺
    this.__Map.addControl(new this.BMap.OverviewMapControl());                                          // 地图右下方那个小前头
    // 下面两个是在地图上显示出的：地图、卫星、三维。
    this.__Map.addControl(new this.BMap.MapTypeControl());
    this.__Map.setCurrentCity(this.__CurrentPosition.address.city);

  }
  CreateTravel() {

  }

  AddMarker() {
    if (this.BMap || this.__CurrentPosition) {
      return;
    }
    const { point } = this.__CurrentPosition;
    // const marker = new this.BMap.Marker(point);        // 创建标注    
    // this.__Map.addOverlay(marker);                     // 将标注添加到地图中
    const self = this;

    const __AddMarker = (point, index) => {  // 创建图标对象   
      const myIcon = new self.BMap.Icon("markers.png", new self.BMap.Size(23, 25), {
        // 指定定位位置。   
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上    
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
        // 图标中央下端的尖角位置。    
        offset: new self.BMap.Size(10, 25),
        // 设置图片偏移。   
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。    
        imageOffset: new self.BMap.Size(0, 0 - index * 25)   // 设置图片偏移    
      });
      // 创建标注对象并添加到地图   
      var marker = new self.BMap.Marker(point, { icon: myIcon });
      self.__Map.addOverlay(marker);
    }
    // 随机向地图添加10个标注    
    var bounds = this.__Map.getBounds();
    var lngSpan = bounds.maxX - bounds.minX;
    var latSpan = bounds.maxY - bounds.minY;
    for (var i = 0; i < 10; i++) {
      var point1 = new this.BMap.Point(bounds.minX + lngSpan * (Math.random() * 0.7 + 0.15),
        bounds.minY + latSpan * (Math.random() * 0.7 + 0.15));
      addMarker(point, i);
    }
  }

}
