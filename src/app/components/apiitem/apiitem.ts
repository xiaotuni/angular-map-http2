import { Component, OnInit, OnChanges, Output, Input, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Utility } from '../ComponentTools';
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

      // state('collapsed,void', style({ position: 'relative', background: '#fff', height: '0px', color: 'maroon', borderColor: 'maroon', display: 'none' })),
      // state('expanded,*', style({ position: 'relative', background: '#fff', height: '*', borderColor: 'green', color: 'green' })),

      // // transition('collapsed => void', [animate(500, style({ background: '#fff', height: '*', color: 'blue' })), animate(100)]),
      // // transition('void => collapsed', [animate(500, style({ background: '#fff', height: '*', color: 'blue' })), animate(100)]),
      // // transition('expanded => void', [animate(500, style({ background: '#fff', height: '*', color: 'blue' })), animate(100)]),
      // // transition('void => expanded', [animate(500, style({ background: '#fff', height: '*', color: 'blue' })), animate(100)]),

      // transition('void => collapsed', [animate(500, style({ transform: 'translateY(-100%)' })), animate('0.6s ease-in-out', style({ transform: 'translateY(0%)' }))]),
      // transition('collapsed => void', [animate(500, style({ transform: 'translateY(0%)' })), animate('0.6s ease-in-out', style({ transform: 'translateY(100%)' }))]),

      // transition('void => expanded', [animate(500, style({ transform: 'translateY(100%)' })), animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))]),
      // transition('expanded => void', [animate(500, style({ transform: 'translateY(0%)' })), animate('0.5s ease-in-out', style({ transform: 'translateY(-100%)' }))])

    ])]
})
export class ApiItem implements OnInit, OnChanges {

  @Input('Source') ApiInfo: any;
  @Input('Index') Index: number;
  @Input('IsExpanded') IsExpanded: boolean;
  stateExpression: string = 'collapsed';


  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  public RuleInfo: any;
  public RuleType: Array<any> = [
    { key: 'query', title: '查询' },
    { key: 'update', title: '更新' },
    { key: 'insert', title: '插入' },
    { key: 'delete', title: '删除' },
    { key: 'beginTran', title: '开始事务' },
    { key: 'commit', title: '提交事务' },
    { key: 'judge', title: '条件判断' },
  ];
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
    const { RuleInfo } = this.ApiInfo || { RuleInfo: {} };
    this.RuleInfo = RuleInfo || {};
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
}
