import {
  Component, OnInit, Input, Output, OnChanges, AfterContentInit, EventEmitter, ElementRef, ViewChild,
  trigger, state, style, transition, animate
} from '@angular/core';
import { Utility } from '../Core';

@Component({
  selector: 'xtn-scroll',
  templateUrl: 'Scroll.html',
  styleUrls: ['Scroll.scss'],
  animations: [
    trigger('Top50', [
      state('Top50Begin', style({ height: '*' })),
      state('Top50End', style({ height: '50px' })),
      transition('Top50End => Top50Begin', animate('1050ms ease-in')),
      transition('active => inactive', animate('1050ms ease-out')),
    ])
  ]
})
export class XtnScroll implements OnInit, OnChanges {

  Info: any;
  @Input('Percentage') _Percentage: number;
  @Input('IsRefreshFinish') _IsRefreshFinish: boolean;
  @Input('IsNextPageFinish') _IsNextPageFinish: boolean;
  @Input('IsSlideLeftFinish') _IsSlideLeftFinish: boolean;
  @Input('IsSlideRightFinish') _IsSlideRightFinish: boolean;
  @Output('onRefresh') _onRefresh: EventEmitter<any> = new EventEmitter();
  @Output('onNextPage') _onNextPage: EventEmitter<any> = new EventEmitter();
  @Output('onSlideLeft') _onSlideLeft: EventEmitter<any> = new EventEmitter();
  @Output('onSlideRight') _onSlideRight: EventEmitter<any> = new EventEmitter();

  @ViewChild('divTop') divTop: ElementRef;
  @ViewChild('divContent') divContent: ElementRef;
  @ViewChild('divBottom') divBottom: ElementRef;

  Top50Name: any;

  constructor() {
    this.Info = {
      Start: { X: 0, Y: 0 },
      Move: { X: 0, Y: 0 },
      End: { X: 0, Y: 0 },
      TitleTop: '下拉刷新',
      TitleBottom: '上拉获取下面数据',
    };
  }

  ngOnInit() {
  }

  ngOnChanges(): void {
    console.log('IsRefreshFinish-->', this._IsRefreshFinish);
    if (!!this._IsRefreshFinish) {
      const { Info, divTop } = this;
      Info.TitleTop = '更新完成...';
      setTimeout(function () {
        divTop.nativeElement.style.height = '0px';
        setTimeout(() => {
          divTop.nativeElement.style.display = 'none';
          Info.TitleTop = '下拉刷新...';
          delete Info.IsTitleTop;
        }, 500);
      }, 500);
    }
  }

  __UpdateLocation(type, event) {
    const { changedTouches } = event;
    const { clientX, clientY } = changedTouches[0];
    this.Info[type].X = clientX;
    this.Info[type].Y = clientY;
  }

  OnTouchStart(event) {
    this.__UpdateLocation('Start', event);
  }

  OnTouchMove(event) {
    this.__UpdateLocation('Move', event);
    this.__JudgeRefreshOrNextPage();
  }

  OnTouchEnd(event) {
    this.__UpdateLocation('End', event);
    this.__RefreshOrNextPageEnd();
    console.log(this.Info);
    const { Start, End } = this.Info;

    const xes = End.X - Start.X;
    const yes = End.Y - Start.Y;

    const absXes = Math.abs(xes);
    const absYes = Math.abs(yes);

    if (absXes < 10 && absYes < 50) {
      // Utility.$actionSheet('absXes: ' + absXes + '; absYes: ' + absYes);
      return;
    }
    // this.Top50Name = 'Top50End';

    if (xes > 0) {
      // 右
      if (yes > 0) {
        // 向下
        // 判断主向
        if (absXes > absYes) {
          // 向右。
          console.log('向右');
          this.SlideRight();
        } else {
          // 向下。
          console.log('向下');
          this.SlideRefresh();
        }

        // 向上
        if (absXes > absYes) {
          // 向右。
          console.log('向右');
          this.SlideRight();
        } else {
          // 向上。
          console.log('向上');
          this.SlideNextPage();
        }
      }
    } else {
      // 左边
      if (yes > 0) {
        // 向下
        if (absXes > absYes) {
          // 向左。
          console.log('向左');
          this.SlideLeft();
        } else {
          // 向下。
          console.log('向下');
          this.SlideRefresh();
        }
      } else {
        // 向上
        if (absXes > absYes) {
          console.log('向左');
          this.SlideLeft();
        } else {
          console.log('向左-->向上');
          this.SlideNextPage();
        }
      }
    }
  }

  SlideLeft() {
    const { _onSlideLeft } = this;
    if (_onSlideLeft) {
      _onSlideLeft.emit();
    }
  }

  SlideRight() {
    const { _onSlideRight } = this;
    if (!_onSlideRight) {
      return;
    }
    _onSlideRight.emit();
  }

  SlideNextPage() {
    const { _onNextPage, _Percentage } = this;
    if (!_onNextPage) {
      return;
    }
    const __bodyScrollTop = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
    const __bodyScrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
    const __differValue = ((__bodyScrollHeight - __bodyScrollTop - screen.height) / __bodyScrollHeight) * 100;
    if (__differValue > (_Percentage < 3 ? 3 : _Percentage)) {
      return;
    }
    _onNextPage.emit();
  }

  SlideRefresh() {
    const { _onRefresh } = this;
    if (!_onRefresh) {
      return;
    }
    _onRefresh.emit();
  }

  __JudgeRefreshOrNextPage() {
    const { Start, Move, TitleTop } = this.Info;
    const xes = Move.X - Start.X;
    const yes = Move.Y - Start.Y;
    const absXes = Math.abs(xes);
    const absYes = Math.abs(yes);
    const { divTop, divBottom } = this;
    if (yes > 0) { // Refresh 操作
      divTop.nativeElement.style.display = 'none';

      if (yes > 20 && absXes < 20) {
        this.Info.TitleTop = '下拉刷新...';
        divTop.nativeElement.style.display = 'inherit';

        if (yes > 50) {
          this.Info.IsTitleTop = true;
          this.Info.TitleTop = '释放刷新数据...';
        }
        if (yes < 120) {
          divTop.nativeElement.style.height = yes + 'px';
        }
      }
    }
  }

  __RefreshOrNextPageEnd() {
    const { Info, divTop } = this;
    if (!!Info.IsTitleTop) {
      Info.TitleTop = '更新中...';
      divTop.nativeElement.style.height = '30px';
    }
  }
}
