import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes.component';
import { NgSelectModule } from '@ng-select/ng-select';

import { SharedModule } from 'src/app/shared/shared.module';
import { AddEditComponent } from './components/add-edit/add-edit.component';


@NgModule({
  declarations: [
    RecipesComponent,
    AddEditComponent,
  ],
  imports: [
    SharedModule,
    DatePipe,
    CommonModule,
    NgSelectModule,
    RecipesRoutingModule,
    NgSelectModule,
  ]
})
export class RecipesModule { }
