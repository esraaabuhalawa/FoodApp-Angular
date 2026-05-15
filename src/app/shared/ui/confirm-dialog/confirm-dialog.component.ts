import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})

export class ConfirmDialogComponent {
  title: string = 'Confirm';
  message: string = 'Are you sure?';
  deleteURl: string = '';
  //Services Injection
  private readonly bsModalRef = inject(BsModalRef)
  private readonly toaster = inject(ToastrService);
  private readonly http = inject(HttpClient);

  //Confirm  Method for Delete
  confirm(): void {
    this.http.delete(this.deleteURl).subscribe({
      next: (res) => {
        this.toaster.success(`${this.title} is deleted successfully`, 'Success!');
        this.bsModalRef.onHidden?.emit({ deleted: true }); // to notify parent that the item is deleted to reload data
        this.cancel();
      },
      error: (err) => {
        this.toaster.error('Failed to delete', 'Error!');
        this.cancel()
      }
    });
  }

  //Close Modal
  cancel(): void {
    this.bsModalRef.hide();
  }
}
