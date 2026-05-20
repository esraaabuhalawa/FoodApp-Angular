import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { adminGuard } from '../../core/guards/admin.guard';
import { userGuard } from '../../core/guards/user.guard';
import { HomeComponent } from '../../shared/components/layout/home/home.component';
import { ProfileComponent } from '../../shared/components/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('../../admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'userPortal',
        canActivate: [userGuard],
        loadChildren: () =>
          import('../../user-portal/user-portal.module').then(m => m.UserPortalModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
