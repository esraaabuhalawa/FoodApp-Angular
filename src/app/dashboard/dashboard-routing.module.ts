import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { roleGuard } from '../core/guards/role.guard';
import { HomeComponent } from '../shared/layout/home/home.component';
import { roleEnum } from '../core/enums/role.enum';

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
        path: 'admin',
        data: { roles: [roleEnum.SuperAdmin] },
        canActivate: [roleGuard],
        loadChildren: () =>
          import('../admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'userPortal',
        data: { roles: [roleEnum.SystemUser, roleEnum.SuperAdmin] },
        canActivate: [roleGuard],
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
