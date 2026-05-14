import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private readonly http = inject(HttpClient)
  getAllTags(): Observable<any> {
    return this.http.get(`tag`);
  }
}
