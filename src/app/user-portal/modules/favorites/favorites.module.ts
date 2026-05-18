import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoritesRoutingModule } from './favorites-routing.module';
import { FavoritesComponent } from './favorites.component';
import { FavoriteCardComponent } from './components/favorite-card/favorite-card.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    FavoritesComponent,
    FavoriteCardComponent,
  ],
  imports: [
    CommonModule,
    FavoritesRoutingModule,
      SharedModule
  ]
})
export class FavoritesModule { }
