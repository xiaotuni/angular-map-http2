import { Component, OnInit, Output, Input } from '@angular/core';
import { Utility } from '../../Common/Utility';
@Component({
  selector: 'xtn-api-item',
  templateUrl: './apiitem.html',
  styleUrls: ['./apiitem.scss']
})
export class ApiItemComponent implements OnInit {

  @Input('Source') ApiInfo: any;
  public RuleInfo: any;
  public RuleType: Array<any> = [
    { key: 'query', title: '查询' },
    { key: 'beginTran', title: '开始事务' },
    { key: 'update', title: '更新' },
    { key: 'insert', title: '插入' },
    { key: 'delete', title: '删除' },
    { key: 'commit', title: '提交事务' }];
  constructor() {
    console.log('constructor', this.ApiInfo);
  }

  ngOnInit() {
    console.log(this.ApiInfo);
    this.RuleInfo = JSON.parse(this.ApiInfo.Content);
    console.log(this.RuleInfo);
  }

  __GoBack() {
    Utility.$GoBack();
  }
}
