import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SidebarComponent } from '../../shared/components/layout/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/layout/navbar/navbar.component';
import { ProfileComponent } from 'src/app/shared/components/profile/profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    BsDropdownModule,
    SharedModule
  ]
})
export class DashboardModule { }
