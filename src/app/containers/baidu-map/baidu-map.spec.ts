import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaiduMap } from './baidu-map';

describe('BaiduMap', () => {
  let component: BaiduMap;
  let fixture: ComponentFixture<BaiduMap>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaiduMap ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaiduMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
