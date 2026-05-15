import { Component } from '@angular/core';
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
export class ForgotPasswordComponent{
  forgotPassForm!: FormGroup
  constructor(private fb: FormBuilder, private authservice: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { this.formInit()}
  private formSub = new Subscription();
  errorMessage: string = '';
  isLoading: boolean = false;

  formInit(): void {
    this.forgotPassForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    })
  }

  onLogin(): void {
    if (this.forgotPassForm.invalid) {
      this.forgotPassForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }

    localStorage.setItem('emailForPasswordReset', this.forgotPassForm.value.email);
    // start loader
    this.formSub.unsubscribe();
    this.isLoading = true;

    this.formSub = this.authservice.RequestPasswordReset(this.forgotPassForm.value.email).subscribe({
      next: (res) => {
        this.errorMessage = '';
        this.toastr.success(res.message, 'Success!');
        this.router.navigate(['/auth/reset-password']);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong';
        this.toastr.error(err.error.message, 'Error!');
        this.isLoading = false;
      },
    });
  }

  getControl(controlName: string): FormControl {
    return this.forgotPassForm.get(controlName) as FormControl
  }

}
