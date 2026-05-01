import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VerifyAccountComponent } from './pages/verify-account/verify-account.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPassComponent } from './pages/reset-pass/reset-pass.component';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    VerifyAccountComponent,
    AuthLayoutComponent,
    ForgotPasswordComponent,
    ResetPassComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    NgxFileDropModule,
  ]
})
export class AuthModule { }
