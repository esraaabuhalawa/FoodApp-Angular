import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { RegisterComponent } from './pages/register/register.component';
import { VerifyAccountComponent } from './pages/verify-account/verify-account.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPassComponent } from './pages/reset-pass/reset-pass.component';

const routes: Routes = [
  { path: '', component: AuthComponent, },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-account', component: VerifyAccountComponent },
  {path: 'reset-password', component: ResetPassComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
