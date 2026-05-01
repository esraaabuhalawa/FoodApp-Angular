import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPortalRoutingModule } from './user-portal-routing.module';
import { UserPortalComponent } from './user-portal.component';


@NgModule({
  declarations: [
    UserPortalComponent
  ],
  imports: [
    CommonModule,
    UserPortalRoutingModule
  ]
})
export class UserPortalModule { }
