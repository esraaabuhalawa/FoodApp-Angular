import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IChangePassword, ILogin, IVerify, ResetPasswordData } from '../models/auth';
import { jwtDecode } from 'jwt-decode';
import { IDecodedToken } from '../models/idecoded-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  private userData = new BehaviorSubject<any>(null);
  userData$ = this.userData.asObservable();

  onLogin(data: ILogin): Observable<any> {
    return this.http.post('Users/Login', data).pipe(
      tap((res: any) => {
        //set Token in local storage
        localStorage.setItem('token', res.token);
        //Decode the token to get user data and set it in userData BehaviorSubject
        const userDecode = jwtDecode<IDecodedToken>(res.token);
        // Set the decoded user data in the BehaviorSubject
        this.userData.next(userDecode);
      })
    )
  }

  //Get User Role
  getRole(): string | null {
  return this.userData.value?.userGroup || null;
}


  //check if user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    // if token exists, check if it's expired;
    try {
      const decoded = jwtDecode<IDecodedToken>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const isValid = decoded.exp! > currentTime;

      if (!isValid) {
        // auto cleanup expired token
        this.logout();
      }
      return isValid;
    } catch {
      localStorage.removeItem('token'); // remove malformed token
      return false;
    }
  }

  //on app reload
  loadUserFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: IDecodedToken = jwtDecode<IDecodedToken>(token);
      this.userData.next(decoded);
    }
  }

  // logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.userData.next(null);
  }

  onRegister(data: FormData): Observable<any> {
    return this.http.post('Users/Register', data);
  }

  onVerifyAccount(data: IVerify): Observable<any> {
    return this.http.put('Users/verify', data);
  }


  RequestPasswordReset(email: string): Observable<any> {
    return this.http.post('Users/Reset/Request', { email });
  }

  RestPassword(data: ResetPasswordData): Observable<any> {
    return this.http.post('Users/Reset', data);
  }

   onChangePassword(data: IChangePassword): Observable<any> {
    return this.http.put('Users/ChangePassword', data);
  }
}
