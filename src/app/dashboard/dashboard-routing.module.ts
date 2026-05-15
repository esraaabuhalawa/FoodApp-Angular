import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { adminGuard } from '../core/guards/admin.guard';
import { userGuard } from '../core/guards/user.guard';
import { HomeComponent } from '../shared/components/layout/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreateAdminComponent } from './pages/create-admin/create-admin.component';

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
        path: 'create-admin',
        component: CreateAdminComponent
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('../admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'userPortal',
        canActivate: [userGuard],
        loadChildren: () =>
          import('../user-portal/user-portal.module').then(m => m.UserPortalModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
