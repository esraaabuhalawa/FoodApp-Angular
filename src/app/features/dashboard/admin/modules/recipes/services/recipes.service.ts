import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private readonly http = inject(HttpClient)

  getRecipeById(id: number): Observable<any> {
    return this.http.get(`Recipe/${id}`);
  }

  addRecipe(data: FormData): Observable<any> {
    return this.http.post('Recipe', data);
  }

  updateRecipe(id: number, data: FormData): Observable<any> {
    return this.http.put(`Recipe/${id}`, data);
  }
}
