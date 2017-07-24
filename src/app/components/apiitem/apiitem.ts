import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Utility } from '../ComponentTools';
@Component({
  selector: 'xtn-api-item',
  templateUrl: './apiitem.html',
  styleUrls: ['./apiitem.scss']
})
export class ApiItem implements OnInit {

  @Input('Source') ApiInfo: any;
  @Input('Index') Index: number;
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
