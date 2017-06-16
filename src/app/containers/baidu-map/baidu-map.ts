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
  __Driving: any;

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
    if (!this.BMap || !this.__CurrentPosition) {
      return;
    }
    const { point } = this.__CurrentPosition;
    // const marker = new this.BMap.Marker(point);        // 创建标注    
    // this.__Map.addOverlay(marker);                     // 将标注添加到地图中
    const self = this;

    const __AddMarker = (point, index) => {  // 创建图标对象   
      const myIcon = new self.BMap.Icon("/assets/img/car-icon.png", new self.BMap.Size(32, 32), {
        // 指定定位位置。   
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上    
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
        // 图标中央下端的尖角位置。    
        offset: new self.BMap.Size(32, 32),
        // 设置图片偏移。   
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。    
        imageOffset: new self.BMap.Size(0, 0 - index * 32)   // 设置图片偏移    
      });
      // 创建标注对象并添加到地图   
      const marker = new self.BMap.Marker(point, { icon: myIcon });

      // 点击图标事件
      marker.addEventListener("click", function (e) {
        console.log('点击图标啦', e);
      });

      // 让图标可以进行拖拽。
      marker.enableDragging();
      marker.addEventListener("dragend", function (e) {
        console.log("当前位置：" + e.point.lng + ", " + e.point.lat);
      })
      self.__Map.addOverlay(marker);
    }
    __AddMarker(point, 0);
  }

  AddInfomation() {
    if (!this.BMap || !this.__Map) {
      return;
    }
    const opts = {
      // width: 50,     // 信息窗口宽度    
      // height: 30,     // 信息窗口高度    
      title: "Hello"  // 信息窗口标题   
    }
    const infoWindow = new this.BMap.InfoWindow("World", opts);  // 创建信息窗口对象    
    this.__Map.openInfoWindow(infoWindow, this.__Map.getCenter());      // 打开信息窗口
  }

  AddPolyline() {
    if (!this.BMap || !this.__Map) {
      return;
    }
    const polyline = new this.BMap.Polyline([
      new this.BMap.Point(116.380734, 39.913616),
      new this.BMap.Point(116.434057, 39.914944)
    ], { strokeColor: "red", strokeWeight: 6, strokeOpacity: 1 });
    this.__Map.addOverlay(polyline);
  }

  __PositionList: Array<any> = new Array<any>();
  __PositionIndex: number = 3;
  __Polyline: any;

  AddPosition() {
    if (!this.BMap || !this.__Map) {
      return;
    }
    const BMap = this.BMap;
    const map = this.__Map;
    const _begin = new this.BMap.Point(116.380734, 39.913616);
    const _end = new this.BMap.Point(116.434057, 39.914944);

    //创建驾车实例
    const driving = new this.BMap.DrivingRoute(this.__Map);
    //第一个驾车搜索
    driving.search(_begin, _end);

    const __self = this;
    driving.setSearchCompleteCallback(function (e) {
      // 添加 maker
      const _Marker_begin = new BMap.Marker(_begin);
      const _Marker_end = new BMap.Marker(_end);
      map.addOverlay(_Marker_begin);
      map.addOverlay(_Marker_end);
      // label
      const lab_begin = new BMap.Label("起点", { offset: new BMap.Size(-30, -60), position: _begin });
      const lab_end = new BMap.Label("终点", { position: _end });
      map.addOverlay(lab_begin);
      map.addOverlay(lab_end);

      //通过驾车实例，获得一系列点的数组
      const pts = driving.getResults().getPlan(0).getRoute(0).getPath();
      __self.__PositionList = pts;
      // 路线。
      const polyline = new BMap.Polyline(pts);
      __self.__Polyline = polyline;
      map.addOverlay(polyline);
      setTimeout(function () {
        //调整到最佳视野
        map.setViewport([_begin, _end]);
        __self.__MovePosition(pts[0], _end);
        map.removeOverlay(_Marker_begin);
        map.removeOverlay(lab_begin);
        // setTimeout(() => {
        //   map.removeOverlay(polyline);
        // }, 500);
      }, 1000);
    });
    this.__Driving = driving;
  }

  __MovePosition(_begin, _end) {
    const BMap = this.BMap;
    const map = this.__Map;
    // 添加 maker
    const _Marker_begin = new BMap.Marker(_begin);
    map.addOverlay(_Marker_begin);
    // label
    const lab_begin = new BMap.Label("当前位置", { offset: new BMap.Size(-30, -40), position: _begin });
    map.addOverlay(lab_begin);
    this.__PositionList.splice(0, this.__PositionIndex);
    // const polyline = new BMap.Polyline(this.__PositionList);
    // map.addOverlay(polyline);
    this.__Polyline.setPath(this.__PositionList);

    // 只移动位置就可以了。
    setTimeout(() => {
      if (this.__PositionList.length > 0) {
        this.__MovePosition(this.__PositionList[0], _end);
        map.removeOverlay(_Marker_begin);
        map.removeOverlay(lab_begin);
        // setTimeout(() => {
        // }, 1000);
      } else {
        map.removeOverlay(this.__Polyline);
      }
    }, 1000);
  }

  AddDefinedOverlay() {
    if (!this.BMap) {
      return;
    }

    function SquareOverlay(center, length, color) {
      this._center = center;
      this._length = length;
      this._color = color;
    };
    SquareOverlay.prototype = new this.BMap.Overlay();// { a: 123, b: 11 }
    SquareOverlay.prototype.initialize = function (map) {
      // 保存map对象实例   
      this._map = map;
      // 创建div元素，作为自定义覆盖物的容器   
      var div = document.createElement("div");
      div.style.position = "absolute";
      // 可以根据参数设置元素外观   
      div.style.width = this._length + "px";
      div.style.height = this._length + "px";
      div.style.background = this._color;
      // 将div添加到覆盖物容器中   
      map.getPanes().markerPane.appendChild(div);
      // 保存div实例   
      this._div = div;
      // 需要将div元素作为方法的返回值，当调用该覆盖物的show、   
      // hide方法，或者对覆盖物进行移除时，API都将操作此元素。   
      return div;
    }

    // 实现绘制方法   
    SquareOverlay.prototype.draw = function () {
      // 根据地理坐标转换为像素坐标，并设置给容器    
      var position = this._map.pointToOverlayPixel(this._center);
      this._div.style.left = position.x - this._length / 2 + "px";
      this._div.style.top = position.y - this._length / 2 + "px";
    }
    // 实现显示方法    
    SquareOverlay.prototype.show = function () {
      if (this._div) {
        this._div.style.display = "";
      }
    }
    // 实现隐藏方法  
    SquareOverlay.prototype.hide = function () {
      if (this._div) {
        this._div.style.display = "none";
      }
    }

    // 添加自定义方法   
    SquareOverlay.prototype.toggle = function () {
      if (this._div) {
        if (this._div.style.display == "") {
          this.hide();
        }
        else {
          this.show();
        }
      }
    }
    SquareOverlay.prototype.addEventListener = function (event, fun) {
      this._div['on' + event] = fun;
    }

    // 添加自定义覆盖物   
    var mySquare = new SquareOverlay(this.__Map.getCenter(), 100, "red");
    this.__Map.addOverlay(mySquare);

    // 事件添加不上去。
    mySquare.addEventListener("click", function (e) {
      console.log('SquareOverlay', e);
    });
    mySquare.addEventListener("mousemover", function (e) {
      console.log('mousemover', e);
    });
    mySquare.onclick = function (e) {
      console.log('mousemover', e);
    }
    mySquare.addEventListener('click', function (e) { console.log('22222222'); });
    mySquare.V.addEventListener('click', function (e) { console.log('3333333333'); });
  }
}


// //创建驾车实例
    // const driving = new this.BMap.DrivingRoute(this.__Map);
    // //第一个驾车搜索
    // driving.search(_begin, _end);
    // const __self = this;
    // driving.setSearchCompleteCallback(function (e) {
    //   try {
    //     //通过驾车实例，获得一系列点的数组
    //     const pts = driving.getResults().getPlan(0).getRoute(0).getPath();
    //     console.log(pts.length);
    //     // 添加 maker
    //     const _Marker_begin = new BMap.Marker(_begin);
    //     map.addOverlay(_Marker_begin);
    //     // label
    //     const lab_begin = new BMap.Label("起点", { position: _begin });
    //     map.addOverlay(lab_begin);
    //     if (pts.length > 5) {
    //       // 路线。
    //       const polyline = new BMap.Polyline(pts);
    //       map.addOverlay(polyline);
    //       setTimeout(function () {
    //         try {
    //           //调整到最佳视野
    //           map.setViewport([_begin, _end]);
    //           __self.__MovePosition(pts.length > 10 ? pts[9] : pts[pts.length - 1], _end);
    //           map.removeOverlay(_Marker_begin);
    //           map.removeOverlay(lab_begin);
    //           map.removeOverlay(polyline);
    //         } catch (ex1) {
    //           console.log('1111', ex1);
    //         }
    //       }, 1000);
    //     }
    //   } catch (ex) {
    //     console.log(ex);
    //   }
    // });