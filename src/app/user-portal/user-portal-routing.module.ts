import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../shared/components/layout/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user-recipes', loadChildren: () => import('./modules/user-recipes/user-recipes.module').then(m => m.UserRecipesModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserPortalRoutingModule { }
