import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { Subscription } from 'rxjs';
import { confirmPasswordValidator } from '../../validators/custom-validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup
  constructor(private fb: FormBuilder,
    private authservice: AuthService,
    private toastr: ToastrService,
    private router: Router) {
      this.formInit();
    }

  private formSub = new Subscription();
  errorMessage: string = '';
  isLoading: boolean = false;
  serverValidationErrors: any[] = [];
  // tel input values
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  imagePreview: string | null = null;

  onFileDrop(files: NgxFileDropEntry[]): void {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Patch form value
          this.registerForm.patchValue({ profileImage: file });

          // Preview
          const reader = new FileReader();
          reader.onload = () => this.imagePreview = reader.result as string;
          reader.readAsDataURL(file);
        });
      }
    }
  }

  onFileOver(event: any): void {
    console.log('File over drop zone');
  }

  onFileLeave(event: any): void {
    console.log('File left drop zone');
  }

  removeImage(): void {
    this.imagePreview = null;
    this.registerForm.patchValue({ profileImage: null });
  }

  formInit(): void {
    this.registerForm = this.fb.group({
      userName: [null, [Validators.required, Validators.maxLength(8), Validators.pattern(/^[A-Za-z]+[0-9]+$/)]],
      country: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      profileImage: [null],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/)]],
      confirmPassword: [null, [Validators.required,]],
    }, {
      validators: confirmPasswordValidator
    })
  }

  getControl(controlName: string): FormControl {
    return this.registerForm.get(controlName) as FormControl;
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.formSub.unsubscribe();
    this.isLoading = true;

    const { phoneNumber, profileImage, ...rest } = this.registerForm.value;

    const formData = new FormData();
    Object.entries({
      ...rest,
      phoneNumber: phoneNumber?.e164Number,
      ...(profileImage && { profileImage })
    }).forEach(([key, val]) => formData.append(key, val as string));

    //formData.forEach((value, key) => console.log(key, value));

    this.formSub = this.authservice.onRegister(formData).subscribe({
      next: (res) => {
        this.errorMessage = '';
        this.toastr.success(res.message, 'Success!');
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong';
        this.toastr.error(err.error.message, 'Error!');

        if (err.error?.additionalInfo?.errors) {
          const backendErrors = err.error?.additionalInfo?.errors;
          if (backendErrors) {
            Object.values(backendErrors).forEach((messages: any) => {
              this.serverValidationErrors.push(...messages);
            });
          }
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.router.navigate(['/auth/verify-account']);
      }
    });
  }

  ngOnInit(): void {
  }
}
