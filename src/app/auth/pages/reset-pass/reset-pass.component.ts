import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../validators/custom-validators';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent {
  resetPassForm!: FormGroup
    constructor(private fb: FormBuilder, private authservice: AuthService,
      private toastr: ToastrService,
      private router: Router
    ) { }
    private formSub = new Subscription();
    showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  serverValidationErrors: any[] = [];
    errorMessage: string = '';
    isLoading: boolean = false;

    formInit(): void {
      this.resetPassForm = this.fb.group({
        email: [null, [Validators.required, Validators.email]],
        seed: [null, [Validators.required]],
        password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/)]],
              confirmPassword: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/)]],
            }, {
              validators: confirmPasswordValidator
            })
    }

    togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

    onVerify(): void {
      if (this.resetPassForm.invalid) {
        this.resetPassForm.markAllAsTouched();
        return;
      }

      this.formSub.unsubscribe();
      this.isLoading = true;

      this.formSub = this.authservice.RestPassword(this.resetPassForm.value).subscribe({
        next: (res) => {
          this.errorMessage = '';
          this.router.navigate(['/auth']);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          this.toastr.error(err.error.message, 'Error!');
          this.isLoading = false;
        },
        complete: () => {
          this.toastr.success('Account verified successfully', 'Success!');
          this.isLoading = false;
        }
      });
    }

    ngOnInit(): void {
      this.formInit();
    }
}
