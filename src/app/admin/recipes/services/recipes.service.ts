import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeParams } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private readonly http = inject(HttpClient)

  getAllTags(): Observable<any> {
    return this.http.get(`tag`);
  }

  getAllCategories(
  pageSize: number = 10,
  pageNumber: number = 1,
  name?: string
): Observable<any> {

  let params: any = {
    pageSize,
    pageNumber
  };

  if (name) {
    params.name = name;
  }

  return this.http.get('Category', { params });
}

  getRecipes(params: RecipeParams): Observable<any> {
  return this.http.get('Recipe', {
    params: { ...params }
  });
}

  // getRecipes(
  //   pageSize: number = 10,
  //   pageNumber: number = 1,
  //   name?: string,
  //   tagId?: number,
  //   categoryId?: number
  // ): Observable<any> {

  //   let params: any = {
  //     pageSize,
  //     pageNumber
  //   };

  //   if (name) {
  //     params.name = name;
  //   }

  //   if (tagId) {
  //     params.tagId = tagId;
  //   }

  //   if (categoryId) {
  //     params.categoryId = categoryId;
  //   }

  //   return this.http.get('Recipe', { params });
  // }

  getRecipeById(id: number): Observable<any> {
    return this.http.get(`Recipe/${id}`);
  }

  addRecipe(data: FormData): Observable<any> {
    return this.http.post('Recipe', data);
  }

  updateRecipe(id: number, data: FormData): Observable<any> {
    return this.http.put(`Recipe/${id}`, data);
  }

  deleteRecipe(id: number): Observable<any> {
    return this.http.delete(`Recipe/${id}`);
  }
}
