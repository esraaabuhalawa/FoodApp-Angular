import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { roleGuard } from '../core/guards/role.guard';
import { redirectGuardGuard } from '../core/guards/redirect-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [redirectGuardGuard], 
        component: DashboardComponent
      },
      {
        path: 'admin',
        data: { roles: ['SuperAdmin'] },
        canActivate: [roleGuard],
        loadChildren: () =>
          import('../admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'userPortal',
        data: { roles: ['SystemUser'] },
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
