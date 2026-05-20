import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient)

  getCategoryById(id: number): Observable<any> {
    return this.http.get(`Category/${id}`);
  }

  addCategory(name: string): Observable<any> {
    return this.http.post('Category', { name });
  }

  updateCategory(id: number, data: any): Observable<any> {
    return this.http.put(`Category/${id}`, data);
  }
}
