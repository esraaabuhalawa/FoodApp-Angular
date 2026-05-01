import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassForm!: FormGroup
    constructor(private fb: FormBuilder, private authservice: AuthService,
      private toastr: ToastrService,
      private router: Router
    ) { }
    private formSub = new Subscription();
    errorMessage: string = '';
    isLoading: boolean = false;

    formInit(): void {
      this.forgotPassForm = this.fb.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/)]]
      })
    }

    onLogin(): void {
      if (this.forgotPassForm.invalid) {
        this.forgotPassForm.markAllAsTouched();
        this.isLoading = false;
        return;
      }

      // start loader
      this.formSub.unsubscribe();
      this.isLoading = true;

      this.formSub = this.authservice.RequestPasswordReset(this.forgotPassForm.value.email).subscribe({
        next: (res) => {
          this.errorMessage = '';
          localStorage.setItem('token', res.token);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Something went wrong';
          this.toastr.error(err.error.message, 'Error!');
          this.isLoading = false;
        },
        complete: () => {
          this.toastr.success('You are Logged In Successfully', 'Success!');
          this.isLoading = false;
          this.router.navigate(['/auth/reset-password']);
        }

      });
    }

    ngOnInit(): void {
      this.formInit();
    }
}
