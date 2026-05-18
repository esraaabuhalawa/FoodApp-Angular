import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeParams } from 'src/app/admin/recipes/models/recipe';

@Injectable({
  providedIn: 'root'
})
export class UserRecipesService {
  private readonly http = inject(HttpClient)

  getRecipes(params: RecipeParams): Observable<any> {
    return this.http.get('Recipe', {
      params: { ...params }
    });
  }

}
