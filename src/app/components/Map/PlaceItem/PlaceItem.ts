import { Component, OnInit, Output, Input, AfterContentInit, EventEmitter } from '@angular/core';
import { Utility, OnDialog } from '../../Core';

@Component({
  selector: 'xtn-map-place-item',
  templateUrl: './PlaceItem.html',
  styleUrls: ['./PlaceItem.scss']
})
export class XtnMapPlaceItem implements OnInit, OnDialog {

  @Input('Place') place: any;
  @Input() Params: any;
  @Input('Params2') Params2: any;
  @Input('Params123') Params123: any;
  @Output('onSave') _onSave: EventEmitter<any> = new EventEmitter();
  @Output('onDelete') _onDelete: EventEmitter<any> = new EventEmitter();
  @Output('onModify') _onModify: EventEmitter<any> = new EventEmitter();

  constructor() {

  }

  ngOnInit() {
  }

  onClickBtn(type) {
    switch (type) {
      case 1:
        this._onSave.emit({ type: 'save', value: type, place: this.place });
        break;
      case 2:
        this._onDelete.emit({ type: 'delete', value: type, place: this.place });
        break;
      case 3:
        this._onModify.emit({ type: 'modify', value: type, place: this.place });
        break;
    }
  }


  onDialogConfirm(dialog) {
    if (this._onSave) {
      this._onSave.emit({ dialog, args: this.place });
    } else {
      dialog.onClose();
    }
  }

  onDialogCancel(dialog) {
    dialog.onClose();
  }
}
