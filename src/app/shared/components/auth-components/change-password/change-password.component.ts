import { Component, inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { matchPasswordValidator } from 'src/app/shared/custom-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnDestroy {
  bsModalRef = inject(BsModalRef)
  private formSub = new Subscription();
  private readonly fb = inject(FormBuilder)
  private readonly authservice = inject(AuthService)
  private readonly toastr = inject(ToastrService)
  forgotPassForm!: FormGroup;

  // Variables
  errorMessage: string = '';
  isLoading: boolean = false;

  // Constructor
  constructor() {
    this.formInit();
  }

  // Life Cycle Hooks
  ngOnDestroy(): void {
    this.formSub.unsubscribe();
  }

  //form functions
  formInit(): void {
    this.forgotPassForm = this.fb.group({
      oldPassword: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/)]],
      newPassword: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/)]],
      confirmNewPassword: [null, [Validators.required]],
    }, {
      validators: matchPasswordValidator('newPassword', 'confirmNewPassword')
    })
  }

  // ApI Functions
  onChangePass(): void {
    if (this.forgotPassForm.invalid) {
      this.forgotPassForm.markAllAsTouched();
      return;
    }

    this.formSub.unsubscribe();
    this.isLoading = true;

    this.formSub = this.authservice.onChangePassword(this.forgotPassForm.value).subscribe({
      next: (res) => {
        this.errorMessage = '';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.toastr.error(err.error.message, 'Error!');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.toastr.success('Your PAssword is Updated Successfully !', 'Success!');
        this.cancel();
      }
    });
  }

  //Helper Functions
  cancel(): void {
    this.bsModalRef.hide();
  }
  getControl(controlName: string): FormControl {
    return this.forgotPassForm.get(controlName) as FormControl
  }
}
