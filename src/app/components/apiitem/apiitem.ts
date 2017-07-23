import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Utility } from '../ComponentTools';
@Component({
  selector: 'xtn-api-item',
  templateUrl: './apiitem.html',
  styleUrls: ['./apiitem.scss']
})
export class ApiItem implements OnInit {

  @Input('Source') ApiInfo: any;
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
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
    // this.RuleInfo = JSON.parse(this.ApiInfo.Content);
    const { RuleInfo } = this.ApiInfo || { RuleInfo: {} };
    this.RuleInfo = RuleInfo || {};
  }

  __ClickMove(type, index) {
    const currentRule = this.RuleInfo.rules[index];
    const __nextIndex = type + index;
    if (__nextIndex >= 0 && __nextIndex < this.RuleInfo.rules.length) {
      const __nextRule = this.RuleInfo.rules[__nextIndex];
      this.RuleInfo.rules[__nextIndex] = currentRule;
      this.RuleInfo.rules[index] = __nextRule;
    }
    if (this.onDelete) {
      this.onDelete.emit({ type, index });
    }
  }
  __ClickDelete(item, index) {
    this.RuleInfo.rules.splice(index, 1);
  }

  __ClickInsert(index) {
    const NewRule = JSON.parse(JSON.stringify(this.RuleInfo.rules[index]));
    this.RuleInfo.rules.splice(index, 0, NewRule);
  }

  __AddRule() {
    if (!this.ApiInfo.RuleInfo.rules) {
      this.ApiInfo.RuleInfo.rules = [];
    }
    this.ApiInfo.RuleInfo.rules.push({});
  }

  onChange_RuleType(item) {
    console.log(item);
  }

  __IsShowResult(ruleType) {
    const ruleTypes = 'beginTran,commit,judge';
    return ruleTypes.indexOf(ruleType) >= 0 ? false : true;
  }

  __ClickDeleteChilrenItem(item, index) {

  }
  __AddJudgeChilrenRule(judgeinfo) {


  }
}
