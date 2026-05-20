import { NgModule } from '@angular/core';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes.component';
import { AddEditComponent } from './components/add-edit/add-edit.component';
import { ViewComponent } from './components/view/view.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    RecipesComponent,
    AddEditComponent,
    ViewComponent
  ],
  imports: [
    SharedModule,
    NgSelectModule,
    RecipesRoutingModule,
    NgSelectModule,
  ]
})
export class RecipesModule { }
