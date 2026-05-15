import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { CurrentUser } from 'src/app/auth/models/currentUser';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FileUtilServiceService } from 'src/app/shared/service/file-util-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  private readonly authService = inject(AuthService)
  private readonly toastr = inject(ToastrService)
  profileForm!: FormGroup;

  showConfirmPassword = false;
  imagePreview: string | null = null;
  selectedImage!: File;
  //validation messages
  errorMessage: string = '';
  isLoading: boolean = false;
  serverValidationErrors: any[] = [];

  constructor(private fb: FormBuilder) {this.initForm();}
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  initForm(): void {
    this.profileForm = this.fb.group(
      {
        userName: [null, [Validators.required, Validators.maxLength(8), Validators.pattern(/^[A-Za-z]+[0-9]+$/)]],
        country: [null, Validators.required],
        phoneNumber: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        profileImage: [null],
        confirmPassword: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/)]],
      }
    );
  }

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

  //Current USer Data
  private readonly fileUtilService = inject(FileUtilServiceService);
  imageLink!:string
  assetUrl = environment.assestUrl;
  loadingData:boolean = false
  currentUser!: CurrentUser;

    getUserData() {
      this.loadingData = true
      this.authService.getCurrentUserData().subscribe({
        next: (res: CurrentUser) => {
          this.loadingData = false
          this.currentUser = res;
          this.profileForm.patchValue({
            userName: this.currentUser.userName,
            email: this.currentUser.email,
            country: this.currentUser.country,
            phoneNumber: this.currentUser.phoneNumber,
            profileImage:this.currentUser.imagePath
          })
          this.imagePreview = this.assetUrl + res.imagePath;
          this.imageLink = res.imagePath || ''
        },
        error: (err) => {
          this.loadingData = false
          this.toastr.error("Error in Fetching User Data",'!Error')
        },
      })
    }
  //Form Submit
  async onSubmit(){
    console.log(this.profileForm.invalid)
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


    formData.forEach((value, key) => console.log(key, value));
    if (this.imageLink && !profileImage) {
      // Convert existing image url to File
      const file = await this.fileUtilService.imageUrlToFile(this.assetUrl + this.imageLink, 'existing-image.png');
      formData.append('profileImage', file);
    }

    this.authService.updateCurrentUserData(formData).subscribe({
      next: (res) => {
        this.errorMessage = '';
        this.toastr.success("Your Profile updated Successfully", 'Success!');
        this.isLoading = false;
        window.location.reload();
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
        // this.router.navigate(['/auth/verify-account']);
      }
    });
  }

  ngOnInit(): void {
    this.getUserData()
  }
}
