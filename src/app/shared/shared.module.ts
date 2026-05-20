import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EmptyStateComponent } from './components/ui/empty-state/empty-state.component';
import { LoaderComponent } from './components/ui/loader/loader.component';
import { PagesHeaderComponent } from './components/ui/pages-header/pages-header.component';
import { FileDropComponent } from './components/ui/file-drop/file-drop.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ProfileComponent } from './components/ui/profile/profile.component';
import { ChangePasswordComponent } from './components/auth-components/change-password/change-password.component';
import { AuthHeaderComponent } from './components/auth-components/auth-header/auth-header.component';
import { FormInputComponent } from './components/auth-components/form-input/form-input.component';
@NgModule({
  declarations: [
    LoaderComponent,
    EmptyStateComponent,
    PagesHeaderComponent,
    FileDropComponent,
    ProfileComponent,
    ChangePasswordComponent,
    AuthHeaderComponent,
    FormInputComponent
  ],
  imports: [
    CommonModule,
    NgxFileDropModule,
    NgxPaginationModule,
    NgSelectModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    NgxIntlTelInputModule
  ],
  exports: [
    CommonModule,
    NgSelectModule,
    NgxPaginationModule,
    FormsModule,
    BsDropdownModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    NgxIntlTelInputModule,
    ProfileComponent,
    LoaderComponent,
    EmptyStateComponent,
    PagesHeaderComponent,
    FileDropComponent,
    ChangePasswordComponent,
    AuthHeaderComponent,
    FormInputComponent
  ]
})
export class SharedModule { }
