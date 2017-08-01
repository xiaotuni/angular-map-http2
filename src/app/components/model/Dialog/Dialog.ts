import {
  EventEmitter, Component, OnInit, Output, Input, ViewChild, ReflectiveInjector,
  ViewContainerRef, ComponentFactoryResolver, ComponentRef, OnDestroy, AfterContentInit
} from '@angular/core';
import { Utility } from '../../Core';

@Component({
  selector: 'xtn-mode-dialog',
  templateUrl: './Dialog.html',
  styleUrls: ['./Dialog.scss']
})
export class XtnDialog implements OnInit, OnDestroy, AfterContentInit {
  @Input('DialogInfo') DialogInfo: any;                                            // 对话框信息
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef; // 组件要存放的地方
  compRef: ComponentRef<any>;                                                      //  加载的组件实例

  constructor(private resolver: ComponentFactoryResolver) {

  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    if (this.compRef) {
      this.compRef.destroy();
    }
  }

  ngAfterContentInit(): void {
    const { IsLoadingComponent } = this.DialogInfo;
    if (!!IsLoadingComponent) {
      this.LoadComponent(this);
    }
  }

  /**
   * 加载组件
   * 
   * @param {*} self 
   * @returns 
   * @memberof XtnDialog
   */
  LoadComponent(self: any) {
    let { ComponentName, Params } = this.DialogInfo;
    let __Component;
    let fact = self.resolver._factories;
    // 根据名称，摸查出组件名称
    fact.forEach((value: any, key: any) => {
      if (key.name === ComponentName) {
        __Component = key;
      }
    });

    if (!__Component) {
      return;
    }

    // 参数设置
    if (!Params) {
      Params = {};
    }
    let inputProviders = Object.keys(Params).map((inputName) => {
      return { provide: inputName, useValue: Params[inputName] };
    });
    let resolvedInputs = ReflectiveInjector.resolve(inputProviders);
    let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.container.parentInjector);
    if (this.compRef) {
      this.compRef.destroy();
    }

    let factory = this.resolver.resolveComponentFactory(__Component);
    // 创建带参数的组件
    this.compRef = factory.create(injector);
    const { Outputs, Inputs } = Params;
    const __self = this;
    const { inputs, outputs } = factory;
    // 向组件传递参数。
    inputs.forEach((item) => {
      const { propName, templateName } = item;
      const inProps = Inputs[templateName];
      // 给组件上的参数赋值操作。
      if (inProps) {
        __self.compRef.instance[propName] = Inputs[templateName];
      }
    });
    // 向外输入参数，这里主要是判断事件处理。
    outputs.forEach((row) => {
      const { propName, templateName } = row;
      const outProps = __self.compRef.instance[row.propName];
      if (outProps as EventEmitter<any>) {
        // 订阅事件处理
        outProps.subscribe((data) => {
          if (Outputs[templateName]) {
            Outputs[templateName](data)
          }
        });
      }
    });
    // 呈现组件的视图
    this.container.insert(this.compRef.hostView);
  }

  onClickClose() {
    Utility.$ShowDialogHide();
  }

  btnClickCancel() {
    if (this.compRef.instance.onCancel) {
      this.compRef.instance.onCancel();
    }
  }

  btnClickConfirm() {
    if (this.compRef) {
      if (this.compRef.instance.onConfirm) {
        this.compRef.instance.onConfirm();
      }
    } else {
      Utility.$ShowDialogHide();
    }
  }
}
