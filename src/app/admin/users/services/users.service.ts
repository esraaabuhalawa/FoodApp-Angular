import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserParams } from './model/user-params';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient)

  getAllUsers(params: UserParams): Observable<any> {
    return this.http.get('Users', { params: { ...params } });
  }

  getUsersById(id: number): Observable<any> {
    return this.http.get(`Users/${id}`);
  }

  addUsers(name: any): Observable<any> {
    return this.http.post('Users', { name });
  }

  //Update Current Profile
  updateUsers(id: number, data: any): Observable<any> {
    return this.http.put(`Users/${id}`, data);
  }
}
