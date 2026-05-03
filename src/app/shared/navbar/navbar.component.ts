import { Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [
    // per-component config (optional)
    { provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true,adaptivePosition: true } }
  ]
})
export class NavbarComponent {
  private  authService = inject(AuthService);
  private router = inject(Router);

  userData$ = this.authService.userData$;

  isSidebarCollapsed = false;
  isMobileOpen = false;
  isMobile = window.innerWidth < 768;

  toggleUser():boolean{
    if(this.authService.getRole() === 'SystemUser'){
      return true;
    }
    return false;
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) this.isMobileOpen = false;
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.isMobileOpen = !this.isMobileOpen;
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
