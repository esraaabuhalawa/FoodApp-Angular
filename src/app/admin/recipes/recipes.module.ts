import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddComponent } from './add/add.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LoaderComponent } from 'src/app/shared/ui/loader/loader.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { EmptyStateComponent } from 'src/app/shared/ui/empty-state/empty-state.component';


@NgModule({
  declarations: [
    RecipesComponent,
    AddComponent,
    LoaderComponent,
    EmptyStateComponent,
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    NgxPaginationModule,
    NgSelectModule,
    RecipesRoutingModule,
    NgSelectModule
  ]
})
export class RecipesModule { }
