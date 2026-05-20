import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { categoryParams } from '../models/category';
import { RecipeParams } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})

export class GeneralService {
  private readonly http = inject(HttpClient)
  getRecipes(params: RecipeParams): Observable<any> {
      return this.http.get('Recipe', {
        params: { ...params }
      });
    }

  getAllCategories(params: categoryParams): Observable<any> {
    return this.http.get('Category', { params: { ...params } });
  }
  getAllTags(): Observable<any> {
    return this.http.get(`tag`);
  }
}
