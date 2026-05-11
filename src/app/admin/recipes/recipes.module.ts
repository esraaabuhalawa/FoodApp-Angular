import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddComponent } from './add/add.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LoaderComponent } from 'src/app/shared/ui/loader/loader.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { EmptyStateComponent } from 'src/app/shared/ui/empty-state/empty-state.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { FileDropComponent } from 'src/app/shared/components/file-drop/file-drop.component';


@NgModule({
  declarations: [
    RecipesComponent,
    AddComponent,
    LoaderComponent,
    EmptyStateComponent,
    FileDropComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    NgxPaginationModule,
    NgSelectModule,
    RecipesRoutingModule,
    NgxFileDropModule,
    NgSelectModule,
    ReactiveFormsModule
]
})
export class RecipesModule { }
