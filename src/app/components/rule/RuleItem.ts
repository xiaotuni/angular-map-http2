import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Utility } from '../ComponentTools';
@Component({
  selector: 'xtn-rule-item',
  templateUrl: './RuleItem.html',
  styleUrls: ['./RuleItem.scss']
})
export class RuleItem implements OnInit {

  @Input('Source') Rule: any;
  @Input('Index') Index: number;
  @Input('ParentId') ParentId: number;
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

  ngOnInit(): void {
    if (this.Index >= 0 && !this.Rule.id) {
      if (this.ParentId) {
        this.Rule.id = this.ParentId * 100 + this.Index;
      } else {
        this.Rule.id = this.Index + 1;
      }
    }


    let { type } = this.Rule;
    const { judgeInfo } = this.Rule;
    if (!type) {
      this.Rule.type = 'query';
    }
    else if (type === 'judge') {
      if (!judgeInfo) {
        this.Rule.judgeInfo = {};
      }
    }
  }

  btn_Click(type, index) {
    if (this.onMoveUpOrDown) {
      this.onMoveUpOrDown.emit({ type, index, OperatorType: this.OperatorType });
    }
  }

  onChange_RuleType(item) {
    console.log(item);
    const { type, judgeInfo } = this.Rule;
    if (item === 'judge') {
      if (!judgeInfo) {
        this.Rule.judgeInfo = {};
      }
    }
  }

  onClickAddRule(rule) {
    let { chilrenRules } = rule;
    if (!Array.isArray(chilrenRules)) {
      chilrenRules = [];
      rule.chilrenRules = chilrenRules;
    }
    chilrenRules.push({ judgeInfo: {} });
  }

  onSubItemMoveUpOrDown(args, currentIndex) {
    const { type, index, OperatorType } = args;
    const rules = this.Rule.judgeInfo.chilrenRules;
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
