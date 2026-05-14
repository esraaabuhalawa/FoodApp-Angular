import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SidebarComponent } from '../shared/components/layout/sidebar/sidebar.component';
import { NavbarComponent } from '../shared/components/layout/navbar/navbar.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    BsDropdownModule
  ]
})
export class DashboardModule { }
