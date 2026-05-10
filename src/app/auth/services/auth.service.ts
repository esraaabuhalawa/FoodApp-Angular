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

  private viewMode = new BehaviorSubject<roleEnum.SystemUser | roleEnum.SuperAdmin>(
    (localStorage.getItem('viewMode') as roleEnum.SystemUser | roleEnum.SuperAdmin) || roleEnum.SystemUser
  );

  viewMode$ = this.viewMode.asObservable();
  userData$ = this.userData.asObservable();

  onLogin(data: ILogin): Observable<any> {
    return this.http.post('Users/Login', data).pipe(
      tap((res: any) => {
        //set Token in local storage
        localStorage.setItem('token', res.token);
        const userDecode = jwtDecode<IDecodedToken>(res.token);
        this.userData.next(userDecode);

        // Set viewMode here — after we know the role
        const isSuperAdmin = userDecode.userGroup === roleEnum.SuperAdmin;
        const storedMode = localStorage.getItem('viewMode') as roleEnum.SystemUser | roleEnum.SuperAdmin;

        // Only use stored if valid; otherwise default to their actual role
        const initialMode = storedMode ?? (isSuperAdmin ? roleEnum.SuperAdmin : roleEnum.SystemUser);
        this.setViewMode(initialMode);
      })
    )
  }

  //Get User Role
  getRole(): string | null {
    return this.userData.value?.userGroup || null;
  }

  getViewMode() {
    return this.viewMode.value;
  }

  setViewMode(mode: roleEnum.SystemUser | roleEnum.SuperAdmin) {
    localStorage.setItem('viewMode', mode);
    this.viewMode.next(mode);
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
      try {
        const decoded: IDecodedToken = jwtDecode<IDecodedToken>(token);
        this.userData.next(decoded);
      } catch {
        localStorage.removeItem('token');
      }
    }
  }

  // logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('viewMode')
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
