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

  __ClickMove(type, index) {
    const currentRule = this.RuleInfo.rules[index];
    const __nextIndex = type + index;
    if (__nextIndex >= 0 && __nextIndex < this.RuleInfo.rules.length) {
      const __nextRule = this.RuleInfo.rules[__nextIndex];
      this.RuleInfo.rules[__nextIndex] = currentRule;
      this.RuleInfo.rules[index] = __nextRule;
    }
    console.log(index);
  }
  __ClickDelete(item, index) {
    this.RuleInfo.rules.splice(index, 1);
  }

  __ClickInsert(index) {
    const NewRule = JSON.parse(JSON.stringify(this.RuleInfo.rules[index]));
    this.RuleInfo.rules.splice(index, 0, NewRule);
    // [].unshift({});
  }
}
