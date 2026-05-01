import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loginForm!: FormGroup
  constructor(private fb: FormBuilder, private authservice: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }
  private formSub = new Subscription();
  showPassword: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  formInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/)]]
    })
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }

    // start loader
    this.formSub.unsubscribe();
    this.isLoading = true;

    this.formSub = this.authservice.onLogin(this.loginForm.value).subscribe({
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
        this.router.navigate(['/dashboard']);
      }

    });
  }

  ngOnInit(): void {
    this.formInit();
  }
}
