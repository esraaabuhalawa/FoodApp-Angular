import { Component, } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})

export class VerifyAccountComponent{
  verifyForm!: FormGroup
  constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private toastr: ToastrService,
    private router: Router) {
      this.formInit();
    }

  private formSub = new Subscription();
  errorMessage: string = '';
  isLoading: boolean = false;

  formInit(): void {
    this.verifyForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      code: [null, [Validators.required]]
    })
  }

  onVerify(): void {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.formSub.unsubscribe();
    this.isLoading = true;

    this.formSub = this.authservice.onVerifyAccount(this.verifyForm.value).subscribe({
      next: (res) => {
        this.errorMessage = '';
         this.toastr.success('Account verified successfully', 'Success!');
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.toastr.error(err.error.message, 'Error!');
        this.isLoading = false;
      },
      complete: () => {
        this.router.navigate(['/auth']);
        this.isLoading = false;
      }
    });
  }

  getControl(controlName: string): FormControl {
    return this.verifyForm.get(controlName) as FormControl
  }
}
