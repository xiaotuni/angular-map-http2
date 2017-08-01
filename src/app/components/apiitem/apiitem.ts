import { Component, OnInit, OnChanges, Output, Input, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Utility } from '../Core';
@Component({
  selector: 'xtn-api-item',
  templateUrl: './apiitem.html',
  styleUrls: ['./apiitem.scss'],
  animations: [trigger(
    'openClose',
    [
      state('collapsed, void', style({ position: 'relative', background: '#fff', height: '0px', color: 'maroon', borderColor: 'maroon', display: 'none' })),
      state('expanded', style({ position: 'relative', background: '#fff', height: '*', borderColor: 'green', color: 'green' })),
      // transition('collapsed <=> expanded', [animate(500, style({ background: '#fff', height: '*', color: 'blue' })), animate(100)]),
      transition('collapsed <=> expanded', [animate('100ms ease-out'), animate('100ms ease-out')]),
    ])]
})
export class XtnApiItem implements OnInit, OnChanges {

  @Input('Source') ApiInfo: any;
  @Input('Index') Index: number;
  @Input('IsExpanded') IsExpanded: boolean;
  stateExpression: string = 'collapsed';


  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  public RuleInfo: any;

  public MethodCollection: Array<any> = [
    { key: 'get', title: 'get' },
    { key: 'delete', title: 'delete' },
    { key: 'post', title: 'post' },
    { key: 'put', title: 'put' },
  ];
  constructor() {
  }
  ngOnChanges(): void {
    this.stateExpression = !!this.IsExpanded ? 'expanded' : 'collapsed';
  }
  ngOnInit() {

    if (!this.ApiInfo) {
      this.ApiInfo = {};
    }
    // if (!this.ApiInfo['IsTokenAccess'] ) {
    //   this.ApiInfo.IsTokenAccess = 1;
    // }
    // if (!this.ApiInfo['Status']) {
    //   this.ApiInfo.Status = 1;
    // }
    if (!this.ApiInfo.RuleInfo) {
      this.ApiInfo.RuleInfo = {};
    }
    this.RuleInfo = this.ApiInfo.RuleInfo;
  }

  btnClickSave() {
    const { onSave, ApiInfo } = this;
    if (onSave) {
      onSave.emit(ApiInfo);
    }
  }

  btnClickDelete() {
    const { onDelete, ApiInfo } = this;
    if (onDelete) {
      onDelete.emit(ApiInfo);
    }
  }

  onClickCheckbox(type) {
    this.ApiInfo[type] = !this.ApiInfo[type];
  }
}
