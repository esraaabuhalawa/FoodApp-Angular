import { Component, inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { matchPasswordValidator } from '../../../../shared/custom-validators';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnDestroy {
  private formSub = new Subscription();
  private readonly fb = inject(FormBuilder)
  private readonly authservice = inject(AuthService)
  private readonly toastr = inject(ToastrService)
  private readonly router = inject(Router)
  resetPassForm!: FormGroup

  // Variables
  serverValidationErrors: any[] = [];
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
    this.resetPassForm = this.fb.group({
      email: [{ value: localStorage.getItem('emailForPasswordReset'), disabled: true }],
      seed: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/)]],
      confirmPassword: [null, [Validators.required]],
    }, {
      validators: matchPasswordValidator('password', 'confirmPassword')
    })
  }
  // API Functions
  onVerify(): void {
    if (this.resetPassForm.invalid) {
      this.resetPassForm.markAllAsTouched();
      return;
    }

    this.formSub.unsubscribe();
    this.isLoading = true;
    let result: string = '';
    const formPayload = this.resetPassForm.getRawValue();

    this.formSub = this.authservice.RestPassword(formPayload).subscribe({
      next: (res) => {
        this.errorMessage = '';
        result = res.message
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.toastr.error(err.error.message, 'Error!');
        this.isLoading = false;
      },
      complete: () => {
        this.toastr.success(result, 'Success!');
        localStorage.removeItem('emailForPasswordReset');
        this.isLoading = false
        this.router.navigate(['/auth']);
      }
    });
  }

  //Helper Functions
  getControl(controlName: string): FormControl {
    return this.resetPassForm.get(controlName) as FormControl
  }
}
