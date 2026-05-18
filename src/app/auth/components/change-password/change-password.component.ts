import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { confirmChangePasswordValidator,} from '../../validators/custom-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
bsModalRef = inject(BsModalRef)

  cancel(): void {
    this.bsModalRef.hide();
  }
  forgotPassForm!: FormGroup
    constructor(private fb: FormBuilder, private authservice: AuthService,
      private toastr: ToastrService,
    ) {
      this.formInit();
    }

    private formSub = new Subscription();
    serverValidationErrors: any[] = [];
    errorMessage: string = '';
    isLoading: boolean = false;

    formInit(): void {
      this.forgotPassForm = this.fb.group({
        oldPassword: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/)]],
        newPassword: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/)]],
        confirmNewPassword: [null, [Validators.required]],
      }, {
        validators: confirmChangePasswordValidator
      })
    }

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
        complete :()=>{
          this.isLoading = false;
          this.toastr.success('Your PAssword is Updated Successfully !', 'Success!');
          this.cancel();
        }
      });
    }

    getControl(controlName: string): FormControl {
      return this.forgotPassForm.get(controlName) as FormControl
    }
}
