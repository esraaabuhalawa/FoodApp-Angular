import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CurrentUser } from 'src/app/features/auth/models/currentUser';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { FileUtilServiceService } from 'src/app/shared/services/file-util-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  private formSub = new Subscription();
  private readonly fb = inject(FormBuilder)
  private readonly authService = inject(AuthService)
  private readonly toastr = inject(ToastrService)
  private readonly fileUtilService = inject(FileUtilServiceService);
  profileForm!: FormGroup;

  //variables
  imageLink!: string
  assetUrl = environment.assestUrl;
  loadingData: boolean = false
  currentUser!: CurrentUser;
  showConfirmPassword = false;
  imagePreview: string | null = null;
  selectedImage!: File;
  errorMessage: string = '';
  isLoading: boolean = false;
  serverValidationErrors: any[] = [];
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  // Constractor
  constructor() {this.initForm();}

  //Life Cycle Hooks
  ngOnInit(): void {
    this.getUserData()
  }

  ngOnDestroy(): void {
    this.formSub.unsubscribe()
  }

  // Form Function
  initForm(): void {
    this.profileForm = this.fb.group(
      {
        userName: [null, [Validators.required, Validators.maxLength(8), Validators.pattern(/^[A-Za-z]+[0-9]+$/)]],
        country: [null, Validators.required],
        phoneNumber: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        profileImage: [null],
        confirmPassword: [null, [Validators.required]],
      }
    );
  }

  //API Functions
  getUserData() {
    this.loadingData = true
    this.authService.getCurrentUserData().subscribe({
      next: (res: CurrentUser) => {
        this.loadingData = false
        this.currentUser = res;
        this.profileForm.patchValue({
          userName: res.userName,
          email: res.email,
          country: res.country,
          phoneNumber: res.phoneNumber,
          profileImage: res.imagePath
        })
        this.imagePreview = this.assetUrl + res.imagePath;
        this.imageLink = res.imagePath || ''
      },
      error: () => {
        this.loadingData = false
        this.toastr.error("Error in Fetching User Data", '!Error')
      },
      complete: () => {
        this.loadingData = false
      }
    })
  }

  async onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { phoneNumber, profileImage, ...rest } = this.profileForm.value;

    const formData = new FormData();
    Object.entries({
      ...rest,
      phoneNumber: phoneNumber?.e164Number,
      profileImage: profileImage
    }).forEach(([key, val]) => formData.append(key, val as string));

    //formData.forEach((value, key) => console.log(key, value));
    if (this.imageLink && !profileImage) {
      // Convert existing image url to File
      const file = await this.fileUtilService.imageUrlToFile(this.assetUrl + this.imageLink, 'existing-image.png');
      formData.append('profileImage', file);
    }

    this.formSub = this.authService.updateCurrentUserData(formData).subscribe({
      next: (res) => {
        this.errorMessage = '';
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
        this.toastr.success("Your Profile updated Successfully", 'Success!');
        window.location.reload();
      }
    });
  }

  // Helper Functions
  onImageSelected(file: File): void {
    this.selectedImage = file;
    this.profileForm.patchValue({
      profileImage: file,
    });
    this.profileForm.get('profileImage')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onImageRemoved(): void {
    this.selectedImage = null as any;
    this.imagePreview = null;
    this.profileForm.patchValue({
      profileImage: null,
    });
  }
}
