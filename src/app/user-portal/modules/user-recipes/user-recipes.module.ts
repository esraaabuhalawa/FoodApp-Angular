import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRecipesRoutingModule } from './user-recipes-routing.module';
import { UserRecipesComponent } from './user-recipes.component';


@NgModule({
  declarations: [
    UserRecipesComponent
  ],
  imports: [
    CommonModule,
    UserRecipesRoutingModule
  ]
})
export class UserRecipesModule { }
