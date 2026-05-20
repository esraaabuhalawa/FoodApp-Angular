import { Component, inject, OnDestroy, } from '@angular/core';
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

export class VerifyAccountComponent implements OnDestroy {
  private formSub = new Subscription();
  private readonly fb = inject(FormBuilder)
  private readonly authservice = inject(AuthService)
  private readonly toastr = inject(ToastrService)
  private readonly router = inject(Router)
  verifyForm!: FormGroup

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
    this.verifyForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      code: [null, [Validators.required]]
    })
  }

  // API Functions
  onVerify(): void {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.formSub = this.authservice.onVerifyAccount(this.verifyForm.value).subscribe({
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
        this.toastr.success('Account verified successfully', 'Success!');
        this.router.navigate(['/auth']);
      }
    });
  }

  //Helper Functions
  getControl(controlName: string): FormControl {
    return this.verifyForm.get(controlName) as FormControl
  }
}
