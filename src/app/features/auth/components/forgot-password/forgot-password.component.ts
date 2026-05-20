import { Component, inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnDestroy {
  private formSub = new Subscription();
  private readonly fb = inject(FormBuilder)
  private readonly authservice = inject(AuthService)
  private readonly toastr = inject(ToastrService)
  private readonly router = inject(Router)
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

  // Forms Functions
  formInit(): void {
    this.forgotPassForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  // API Functions
  onLogin(): void {
    if (this.forgotPassForm.invalid) {
      this.forgotPassForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }

    // start loader
    this.isLoading = true;
    let result:string = '' ;
    this.formSub = this.authservice
      .RequestPasswordReset(this.forgotPassForm.value.email)
      .subscribe({
        next: (res) => {
          this.errorMessage = '';
          result = res.message
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Something went wrong';
          this.toastr.error(err.error.message, 'Error!');
          this.isLoading = false;
        },
        complete:() =>{
          this.toastr.success(result, 'Success!');
           localStorage.setItem('emailForPasswordReset', this.forgotPassForm.value.email);
           this.router.navigate(['/auth/reset-password']);
        }
      });
  }

  // Helper Functions
  getControl(controlName: string): FormControl {
    return this.forgotPassForm.get(controlName) as FormControl;
  }
}
