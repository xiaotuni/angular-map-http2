import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Utility } from '../Core';
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

  FileTypes: Array<any> = [
    { key: 'image', title: '图片' },
    { key: 'video', title: '视频' },
    { key: 'doc', title: '文档' },
    { key: 'other', title: '其它' },
  ];

  public RuleType: Array<any> = [
    { key: 'query', title: '查询' },
    { key: 'update', title: '更新' },
    { key: 'insert', title: '插入' },
    { key: 'delete', title: '删除' },
    { key: 'beginTran', title: '开始事务' },
    { key: 'commit', title: '提交事务' },
    { key: 'judge', title: '条件判断' },
    { key: 'cache', title: '保存到缓存' },
    { key: 'setvalue', title: '赋值操作' },
    { key: 'parentrelation', title: '主子关系' },
    { key: 'captcha', title: '验证码' },
    { key: 'file', title: '文件上传' },
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
    const { judgeInfo, setValues, parentRelation, captcha, files } = this.Rule;
    if (!type) {
      this.Rule.type = 'query';
    } else if (type === 'judge') {
      if (!judgeInfo) {
        this.Rule.judgeInfo = {};
      }
    } else if (type === 'setvalue') {
      if (!setValues) {
        this.Rule.setValues = [];
      }
    } else if (type === 'parentRelation'.toLocaleLowerCase()) {
      if (!parentRelation) {
        this.Rule.parentRelation = { fields: [] }
      }
    } else if (type === 'captcha' && !captcha) {
      this.Rule.captcha = {};
    } else if (type === 'file' && !files) {
      this.Rule.files = { type: this.FileTypes[0].key };
    }
  }

  btn_Click(type, index) {
    if (this.onMoveUpOrDown) {
      this.onMoveUpOrDown.emit({ type, index, OperatorType: this.OperatorType });
    }
  }

  onChange_RuleType(item) {
    const { type, judgeInfo, files, cacheInfo, setValues, parentRelation, captcha } = this.Rule;
    if (item === 'judge' && !judgeInfo) {
      this.Rule.judgeInfo = {};
    } else if (item === 'cache' && !cacheInfo) {
      this.Rule.cacheInfo = {};
    } else if (item === 'setvalue' && !setValues) {
      this.Rule.setValues = [];
    } else if (item === 'parentRelation'.toLocaleLowerCase() && !parentRelation) {
      this.Rule.parentRelation = { fields: [] }
    } else if (type === 'captcha' && !captcha) {
      this.Rule.captcha = {};
    } else if (type === 'file' && !files) {
      this.Rule.files = { type: this.FileTypes[0].key };

    }
  }

  onChange_FileType(type) {
    console.log(type);
    this.Rule.files.filePath = './public/' + type;
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

  onClickAddSetvalue() {
    const { judgeInfo, setValues } = this.Rule;
    setValues.push({});
  }

  onBtnClickAddRelation() {
    console.log('---------------onBtnClickAddRelation--------');
    let { fields } = this.Rule.parentRelation;
    if (!fields) {
      fields = [];
      this.Rule.parentRelation.fields = fields;
    }
    fields.push({});
  }

  onBtnClickDeleteField(index) {
    this.Rule.parentRelation.fields.splice(index, 1);
  }
  onClickCaptcha() {
    this.Rule.captcha.isDelete = !this.Rule.captcha.isDelete;
  }

}
