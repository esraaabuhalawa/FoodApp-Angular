import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritService {
  private readonly http = inject(HttpClient)

  getUserFavoriteRecipes(params: any): Observable<any> {
    return this.http.get('userRecipe', {
      params: { ...params }
    });
  }

  addRecipeToFavorite(id: number): Observable<any> {
    return this.http.post('userRecipe', {
      recipeId: id
    });
  }

  deleteRecipefromFavorite(id: number): Observable<any> {
    return this.http.delete(`userRecipe/${id}`);
  }
}
