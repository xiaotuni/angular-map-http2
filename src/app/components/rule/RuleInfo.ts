import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Utility } from '../ComponentTools';
@Component({
  selector: 'xtn-rule-info',
  templateUrl: './RuleInfo.html',
  styleUrls: ['./RuleInfo.scss']
})
export class RuleInfo implements OnInit {

  @Input('Source') Info: any;
  @Input('Index') Index: number;

  @Output() onDelete: EventEmitter<any> = new EventEmitter();

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

  onItemMoveUpOrDown(args, currentIndex) {
    const { type, index, OperatorType } = args;
    switch (type) {
      case OperatorType.UP:
      case OperatorType.DOWN:
        const currentItem = this.Info.rules[currentIndex];
        const newItem = this.Info.rules[index];
        this.Info.rules[index] = currentItem;
        this.Info.rules[currentIndex] = newItem;
        break;

      case OperatorType.INSERT:
        this.Info.rules.splice(currentIndex, 0, {});
        break;
      case OperatorType.DELETE:
        this.Info.rules.splice(currentIndex, 1);
        break;
    }
  }

  onClickAdd() {
    let { rules } = this.Info;
    if (!rules) {
      rules = [];
      this.Info.rules = rules;
    }
    rules.push({});
  }

}
