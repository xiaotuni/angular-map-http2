import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Utility } from '../ComponentTools';
@Component({
  selector: 'xtn-rule-item',
  templateUrl: './RuleItem.html',
  styleUrls: ['./RuleItem.scss']
})
export class RuleItem implements OnInit {

  @Input('Source') Rule: any;
  @Input('Index') Index: Number;
  @Input('IsFirst') IsFirst: Boolean;
  @Input('IsLast') IsLast: Boolean;

  @Output() onMoveUpOrDown: EventEmitter<any> = new EventEmitter();


  public OperatorType: any = {
    UP: 'move_up',
    DOWN: 'move_down',
    INSERT: 'insert',
    DELETE: 'delete',
  }

  public RuleType: Array<any> = [
    { key: 'query', title: '查询' },
    { key: 'update', title: '更新' },
    { key: 'insert', title: '插入' },
    { key: 'delete', title: '删除' },
    { key: 'beginTran', title: '开始事务' },
    { key: 'commit', title: '提交事务' },
    { key: 'judge', title: '条件判断' },
  ];

  constructor() {
  }

  ngOnInit() {

  }

  __ClickMove(type, index) {
    if (this.onMoveUpOrDown) {
      this.onMoveUpOrDown.emit({ type, index, OperatorType: this.OperatorType });
    }
  }


  onChange_RuleType(item) {
    console.log(item);
    const { type, judgeinfo } = this.Rule;
    if (item === 'judge') {
      if (!judgeinfo) {
        this.Rule.judgeinfo = {};
      }
    }
  }

  onClickAddRule(rule) {
    let { chilrenRules } = rule;
    if (chilrenRules && chilrenRules.length > 0) {
      rule.chilrenRules.push(JSON.parse(JSON.stringify(rule.chilrenRules[rule.chilrenRules.length - 1])));
      return;
    }
    chilrenRules = [];
    rule.chilrenRules = chilrenRules;
    chilrenRules.push({ judgeinfo: {} });
  }

  onSubItemMoveUpOrDown(args, currentIndex) {
    const { type, index, OperatorType } = args;
    const rules = this.Rule.judgeinfo.chilrenRules;
    switch (type) {
      case OperatorType.UP:
      case OperatorType.DOWN:
        const currentItem = rules[currentIndex];
        const newItem = rules[index];
        rules[index] = currentItem;
        rules[currentIndex] = newItem;
        break;

      case OperatorType.INSERT:
        rules.splice(currentIndex, 0, JSON.parse(JSON.stringify(rules[currentIndex])));
        break;
      case OperatorType.DELETE:
        rules.splice(currentIndex, 1);
        break;
    }
  }

}
