import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeParams } from 'src/app/shared/models/recipe';

@Injectable({
  providedIn: 'root'
})
export class FavoritService {
  private readonly http = inject(HttpClient)

  getUserFavoriteRecipes(params: RecipeParams): Observable<any> {
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
