import { Component, HostListener, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private router = inject(Router);
  //  isSidebarCollapsed = false;
  // isMobileOpen = false;
  // isMobile = window.innerWidth < 768;


  // @HostListener('window:resize')
  // onResize() {
  //   this.isMobile = window.innerWidth < 768;
  //   if (!this.isMobile) this.isMobileOpen = false;
  // }

// toggleSidebar() {
//     if (this.isMobile) {
//       this.isMobileOpen = !this.isMobileOpen;
//     } else {
//       this.isSidebarCollapsed = !this.isSidebarCollapsed;
//     }
//   }

  ngOnInit(): void {
    const role = this.authService.getRole();

    if (role === 'SuperAdmin') {
      this.router.navigate(['/dashboard/admin']);
    } else if (role === 'SystemUser') {
      this.router.navigate(['/dashboard/userPortal']);
    }
  }

  // logout(){
  //   this.authService.logout();
  //   this.router.navigate(['/auth/login']);
  // }
}
