import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { CurrentUser } from 'src/app/auth/models/currentUser';
import { AuthService } from 'src/app/auth/services/auth.service';
import { roleEnum } from 'src/app/core/enums/role.enum';
import { NavbarUiService } from 'src/app/core/services/navbar-ui.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [
    // per-component config (optional)
    { provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true, adaptivePosition: true } }
  ]
})

export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  readonly navbarUiService = inject(NavbarUiService);
  private readonly router = inject(Router)

  assetUrl = environment.assestUrl
  isMobile$ = this.navbarUiService.isMobile$
  currentViewMode$ = this.authService.viewMode$;
  currentUser!: CurrentUser;

  switchToUserView() {
    this.authService.setViewMode(roleEnum.SystemUser);
    this.router.navigate(['/dashboard/userPortal']);
  }

  switchToAdminView() {
    this.authService.setViewMode(roleEnum.SuperAdmin);
    this.router.navigate(['/dashboard/admin']);
  }

  get isSuperAdmin(): boolean {
    return this.authService.getRole() === roleEnum.SuperAdmin;
  }

  // @HostListener('window:resize')
  // onResize() {
  //   this.navbarUiService.setMobile(window.innerWidth <= 768);
  // }

  getUserData() {
    this.authService.getCurrentUserData().subscribe({
      next: (res: CurrentUser) => {
        this.currentUser = res
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  toggleSidebar() {
    this.navbarUiService.toggleSidebar()
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.getUserData();
  }
}
