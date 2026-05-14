import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from './ui/empty-state/empty-state.component';
import { LoaderComponent } from './ui/loader/loader.component';
import { PagesHeaderComponent } from './ui/pages-header/pages-header.component';
import { FileDropComponent } from './components/file-drop/file-drop.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    LoaderComponent,
    EmptyStateComponent,
    PagesHeaderComponent,
    FileDropComponent
  ],
  imports: [
    CommonModule,
    NgxFileDropModule,
    NgxPaginationModule,
    NgSelectModule,
      FormsModule,
      BsDropdownModule.forRoot(),
      ReactiveFormsModule
    // NgSelectModule,
    // ReactiveFormsModule
  ],
  exports: [
    LoaderComponent,
    EmptyStateComponent,
    PagesHeaderComponent,
    FileDropComponent,
    NgSelectModule,
    NgxPaginationModule,
      FormsModule,
      BsDropdownModule,
      ReactiveFormsModule
  ]
})
export class SharedModule { }
