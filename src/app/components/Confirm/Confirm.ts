import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Utility, OnDialog } from '../Core';

@Component({
  moduleId: module.id,
  selector: 'xtn-confirm',
  templateUrl: 'Confirm.html',
  styleUrls: ['./Confirm.scss']
})
export class XtnConfirm implements OnInit, OnDialog {

  @Input('Title') _Title: string;                   //标题
  @Output('onConfirm') _onConfirm: EventEmitter<any> = new EventEmitter();
  InputValue: string;

  constructor() { }

  ngOnInit() {

  }

  onDialogConfirm(dialog): void {
    if (this._onConfirm) {
      this._onConfirm.emit({ dialog, args: this.InputValue });
    }
  }

  onDialogCancel(dialog): void {
    dialog.onClose();
  }

}