import { Component, inject, } from '@angular/core';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { roleEnum } from 'src/app/core/enums/role.enum';
import { NavbarUiService } from 'src/app/core/services/navbar-ui.service';
interface Menu {
  label: string,
  icon: string,
  routerNavigate: string,
  isActive: boolean
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {
  private authService = inject(AuthService);
  readonly navbarUiService = inject(NavbarUiService);
  //private destroy$ = new Subject<void>();

  // use observables from service
  // isSidebarCollapsed$ = this.navbarUiService.isSidebarCollapsed$;
  isMobileOpen$ = this.navbarUiService.isMobileOpen$;
  isMobile$ = this.navbarUiService.isMobile$;

  //Menu
  isSuperAdmin(): boolean {
    return this.authService.getRole() === roleEnum.SuperAdmin;
  }

  isUser(): boolean {
    return this.authService.getRole() === roleEnum.SystemUser;
  }


  navMenu: Menu[] = [
    {
      label: 'Home',
      icon: 'fa fa-home',
      routerNavigate: '/dashboard/home',
      isActive: this.isSuperAdmin() || this.isUser()
    },
    {
      label: 'Users',
      icon: 'fa-solid fa-user-group',
      routerNavigate: '/dashboard/admin/users',
      isActive: this.isSuperAdmin()
    },
    {
      label: 'Recipes',
      icon: 'fa-solid fa-border-all',
      routerNavigate: '/dashboard/admin/recipes',
      isActive: this.isSuperAdmin()
    },
    {
      label: 'Categories',
      icon: 'fa-regular fa-calendar-days',
      routerNavigate: '/dashboard/admin/categories',
      isActive: this.isSuperAdmin()
    },
    {
      label: 'Recipes',
      icon: 'fa-solid fa-border-all',
      routerNavigate: '/dashboard/userPortal/user-recipes',
      isActive: this.isUser()
    },
    {
      label: 'Favorites',
      icon: 'fa-regular fa-heart',
      routerNavigate: '/dashboard/userPortal/favorites',
      isActive: this.isUser()
    }
  ];;


  // onResize() {
  //   this.navbarUiService.setMobile(window.innerWidth <= 992);
  // }

  toggleSidebar() {
    this.navbarUiService.toggleSidebar();
  }

  onNavItemClick(): void {
    if (window.innerWidth <= 992) {
      this.navbarUiService.closeMobileMenu();
    }
  }

  ngOnDestroy() {
    // this.destroy$.next();
    // this.destroy$.complete();
  }
}
