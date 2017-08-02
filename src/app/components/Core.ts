export { Utility } from '../Common/Utility';

export interface OnDialog {
  onDialogConfirm(dialog: any): void;
  onDialogCancel(dialog: any): void;
}
// export interface onDialogCancel { onCancel(): void; }