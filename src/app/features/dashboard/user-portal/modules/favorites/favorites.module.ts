import { NgModule } from '@angular/core';
import { FavoritesRoutingModule } from './favorites-routing.module';
import { FavoritesComponent } from './favorites.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    FavoritesComponent,
  ],
  imports: [
    FavoritesRoutingModule,
    SharedModule
  ]
})
export class FavoritesModule { }
