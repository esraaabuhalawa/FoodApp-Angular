import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IChangePassword, ILogin, IVerify, ResetPasswordData } from '../models/auth';
import { jwtDecode } from 'jwt-decode';
import { IDecodedToken } from '../models/idecoded-token';
import { Router } from '@angular/router';
import { roleEnum } from 'src/app/core/enums/role.enum';
import { CurrentUser } from '../models/currentUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)
  private userData = new BehaviorSubject<any>(null);
  userData$ = this.userData.asObservable();

  // onLogin(data: ILogin): Observable<any> {
  //   return this.http.post('Users/Login', data).pipe(
  //     tap((res: any) => {
  //       //set Token in local storage
  //       localStorage.setItem('token', res.token);
  //       const userDecode = jwtDecode<IDecodedToken>(res.token);
  //       this.userData.next(userDecode);
  //       if(userDecode){
  //         localStorage.setItem('role',userDecode.userGroup);
  //       }
  //     })
  //   )
  // }

  onLogin(data: ILogin): Observable<any> { return this.http.post('Users/Login', data) }
  getProfile() {
    let token = localStorage.getItem('token');
    if (token) {
      let userDecode = jwtDecode<IDecodedToken>(token);
      this.userData.next(userDecode);
      localStorage.setItem('userRole', userDecode.userGroup);
    }
  }

  //Get User Role
  getRole(): string | null {
    return localStorage.getItem('userRole') || null;
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
      localStorage.removeItem('token'); // remove  token
      return false;
    }
  }

  //on app reload
  // loadUserFromToken() {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     try {
  //       const decoded: IDecodedToken = jwtDecode<IDecodedToken>(token);
  //       this.userData.next(decoded);
  //     } catch {
  //       localStorage.removeItem('token');
  //     }
  //   }
  // }

  // logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.userData.next(null);
    this.router.navigate(['/auth/login']);
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

  getCurrentUserData(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>('Users/currentUser');
  }

  onChangePassword(data: IChangePassword): Observable<any> {
    return this.http.put('Users/ChangePassword', data);
  }
}
