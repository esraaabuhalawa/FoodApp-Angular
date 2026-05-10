import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NavbarUiService {
  private isMobile = new BehaviorSubject<boolean>(false);
 //private isMobile = new BehaviorSubject<boolean>(window.innerWidth <= 768);
  private isSidebarCollapsed = new BehaviorSubject<boolean>(false);
  private isMobileOpen = new BehaviorSubject<boolean>(false);

  isMobile$ = this.isMobile.asObservable();
  isSidebarCollapsed$ = this.isSidebarCollapsed.asObservable();
  isMobileOpen$ = this.isMobileOpen.asObservable();

//   constructor() {
//   fromEvent(window, 'resize')
//     .pipe(debounceTime(100))
//     .subscribe(() => {
//       this.isMobile.next(window.innerWidth <= 768);
//     });
// }

  constructor() {
    //set initial value
    this.setMobile(window.innerWidth <= 768);

    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.setMobile(window.innerWidth <= 768);
      });
  }

  setMobile(value: boolean) {
    this.isMobile.next(value);

    if (value) {
      this.isSidebarCollapsed.next(false);
    } else {
      this.isMobileOpen.next(false);
    }
  }

  closeMobileMenu() {
    this.isMobileOpen.next(false);
  }

  toggleSidebar() {
    if (this.isMobile.value) {
      this.isMobileOpen.next(!this.isMobileOpen.value);
    } else {
      this.isSidebarCollapsed.next(!this.isSidebarCollapsed.value);
    }
  }
}
