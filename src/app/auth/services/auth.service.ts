import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChangePassword, ILogin, IVerify, ResetPasswordData } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  onLogin(data: ILogin):Observable<any>{
    return this.http.post('Users/Login', data);
  }

  onRegister(data: FormData):Observable<any>{
    return this.http.post('Users/Register', data);
  }

  onVerifyAccount(data: IVerify):Observable<any>{
    return this.http.put('Users/verify', data);
  }

  onChangePassword(data: IChangePassword):Observable<any>{
    return this.http.put('Users/ChangePassword', data);
  }

  RequestPasswordReset(email: string):Observable<any>{
    return this.http.post('Users/Reset/Request', { email });
  }

  RestPassword(data: ResetPasswordData):Observable<any>{
    return this.http.post('Users/Reset', data);
  }

}
