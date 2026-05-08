import { Component, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  loginForm!: FormGroup
  constructor(private fb: FormBuilder, private authservice: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.formInit();
  }

  private formSub = new Subscription();
  errorMessage: string = '';
  isLoading: boolean = false;

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
        this.toastr.success('You are Logged In Successfully', 'Success!');
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong';
        this.toastr.error(err.error.message, 'Error!');
        this.isLoading = false;
      },
      complete:() =>{
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  getControl(controlName:string) : FormControl{
    return this.loginForm.get(controlName) as FormControl
  }
}
