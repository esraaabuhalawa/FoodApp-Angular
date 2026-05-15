import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddEditComponent } from './components/add-edit/add-edit.component';
import { ViewComponent } from './components/view/view.component';


@NgModule({
  declarations: [
    UsersComponent,
    AddEditComponent,
    ViewComponent,

  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }
