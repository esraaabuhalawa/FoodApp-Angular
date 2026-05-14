import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { AddEditComponent } from './components/add-edit/add-edit.component';

const routes: Routes = [
  { path: '', component: RecipesComponent },
  {path: 'add', component: AddEditComponent},
  {path: 'edit/:id', component: AddEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
