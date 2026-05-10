import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})

export class ConfirmDialogComponent {
  title: string = 'Confirm';
  message: string = 'Are you sure?';

  confirmCallback?: () => void;

  constructor(public bsModalRef: BsModalRef) { }


  confirm(): void {
    if (this.confirmCallback) {
      this.confirmCallback();
    }

    this.bsModalRef.hide();
  }

  cancel(): void {
    this.bsModalRef.hide();
  }
}
