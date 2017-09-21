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
  private defaultFileInfo: any = [{ TableName: '', Fields: [{}] }];

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
    { key: 'files', title: '文件上传' },
    { key: 'apiCall', title: '调用第三方API' },
  ];
  public ThirdPartyApiMethod: Array<any> = [
    { key: 'get', title: 'get' },
    { key: 'delete', title: 'delete' },
    { key: 'post', title: 'post' },
    { key: 'put', title: 'put' },
  ];

  constructor() {

    const tf = this.FileTypes[0];
    this.defaultFileInfo = {
      type: tf.key, filePath: './public/' + tf.key,
      filePathField: 'filepath',
      fileNameField: 'filename',
      Relations: [{ TableName: '', Fields: [] }],
      // Relation: {
      //   TableName: '',
      //   Fields: [{}]
      // }
    }
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
    const { judgeInfo, setValues, parentRelation, captcha, files, apiCall } = this.Rule;
    if (!type) { // 查询操作
      this.Rule.type = 'query';
    } else if (type === 'judge') {  // 判断操作
      if (!judgeInfo) {
        this.Rule.judgeInfo = {};
      }
    } else if (type === 'setvalue') {    // 赋值操作
      if (!setValues) {
        this.Rule.setValues = [];
      }
    } else if (type === 'parentRelation'.toLocaleLowerCase()) {      // 主表与从表的关系
      if (!parentRelation) {
        this.Rule.parentRelation = { fields: [] }
      }
    } else if (type === 'captcha' && !captcha) { // 验证码
      this.Rule.captcha = {};
    } else if (type === 'files') {    // 文件关系
      if (!files) {
        this.Rule.files = this.defaultFileInfo; // { type: tf.key, filePath: './public/' + tf.key };
      } else {
        let { Relation, Relations } = files;
        if (!Relations) {
          Relations = [];
          files.Relations = Relations;
          Relations.push(Relation || { TableName: '', Fields: [{}] });
        }
      }
    } else if (type === 'apiCall' && !apiCall) {
      this.Rule.apiCall = {};
    }
  }

  onChange_RuleType(item) {
    const { type, judgeInfo, files, cacheInfo, setValues, parentRelation, captcha, apiCall } = this.Rule;
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
      // const tf = this.FileTypes[0];
      // this.Rule.files = { type: tf.key, filePath: './public/' + tf.key };
      this.Rule.files = this.defaultFileInfo;
    } else if (type === 'apiCall' && !apiCall) {
      this.Rule.apiCall = {};
    }
  }

  btn_Click(type, index) {
    if (this.onMoveUpOrDown) {
      this.onMoveUpOrDown.emit({ type, index, OperatorType: this.OperatorType });
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

  btnDeleteFileRelationField(index, fileds) {
    if (fileds.length > 1) {
      fileds.splice(index, 1);
    }
  }

  btnAddFileRelationField(index, fields) {
    fields.splice(index + 1, 0, {});
  }

  btnAddTableRelation(index, tables) {
    console.log('btnAddTableRelation', tables);
    tables.splice(index + 1, 0, { TableName: '', Fields: [{}] });
  }

  btnDeleteTableRelation(index, tables) {
    console.log('btnDeleteTableRelation', tables);
    if (tables.length > 1) {
      tables.splice(index, 1);
    }

  }

  btnClickThirdPartyApi(apiParam, index, apiParamList, operator) {
    if (operator === 1) {
      if (index === -1) {
        if (!apiParamList) {
          apiParamList = [];
          this.Rule.apiCall.ApiHeaderParams = apiParamList;
        }
      }
      apiParamList.splice(index + 1, 0, {});
      return;
    }

    apiParamList.splice(index, 1);
  }

  btnClickThirdPartyApiBody(apiParam, index, apiParamList, operator) {
    if (operator === 1) {
      if (index === -1) {
        if (!apiParamList) {
          apiParamList = [];
          this.Rule.apiCall.ApiBodyParams = apiParamList;
        }
      }
      apiParamList.splice(index + 1, 0, {});
      return;
    }
    apiParamList.splice(index, 1);
  }

  onClickSetFixedValue(item) {
    item.IsFixedValue = !item.IsFixedValue;
  }

}