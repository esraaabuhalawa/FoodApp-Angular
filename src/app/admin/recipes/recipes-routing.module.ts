import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { AddComponent } from './add/add.component';

const routes: Routes = [
  { path: '', component: RecipesComponent },
  {path: 'add', component:AddComponent},
  {path: 'edit/:id', component:AddComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
