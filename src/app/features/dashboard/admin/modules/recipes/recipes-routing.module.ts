import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { AddEditComponent } from './components/add-edit/add-edit.component';

const routes: Routes = [
  { path: '', component: RecipesComponent, title: 'Recipes Page' },
  { path: 'add', component: AddEditComponent, title: 'Add Recipe Page' },
  { path: 'edit/:id', component: AddEditComponent, title: 'Edit Recipe Page' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
