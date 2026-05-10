import { Component, inject, } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
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
  private readonly router = inject(Router);
  private destroy$ = new Subject<void>();
  navMenu: Menu[] = [];

  // use observables from service
  isSidebarCollapsed$ = this.navbarUiService.isSidebarCollapsed$;
  isMobileOpen$ = this.navbarUiService.isMobileOpen$;
  isMobile$ = this.navbarUiService.isMobile$;

  //Menu
  get isSuperAdmin(): boolean {
    return this.authService.getRole() === 'SuperAdmin';
  }

  get isUser(): boolean {
    return this.authService.getRole() === 'SystemUser';
  }

  //HOme Active Conditions
  isHomeActive(item: any): boolean {
    if (item.label !== 'Home') {
      return false;
    }
    return (
      this.router.url === '/dashboard/home' ||
      this.router.url === '/dashboard/admin' ||
      this.router.url === '/dashboard/userPortal'
    );
  }

  private buildMenu(): Menu[] {
    return [
      {
        label: 'Home',
        icon: 'fa fa-home',
        routerNavigate: '/dashboard/home',
        isActive: true
      },
      {
        label: 'Users',
        icon: 'fa-solid fa-user-group',
        routerNavigate: '/dashboard/home',
        isActive: (this.isSuperAdmin && this.authService.getViewMode() === roleEnum.SuperAdmin)
      },
      {
        label: 'Recipes',
        icon: 'fa-solid fa-border-all',
        routerNavigate: '/dashboard/admin/recipes',
        isActive: (this.isSuperAdmin && this.authService.getViewMode() === roleEnum.SuperAdmin)
      },
      {
        label: 'Categories',
        icon: 'fa-regular fa-calendar-days',
        routerNavigate: '/dashboard/home',
        isActive: (this.isSuperAdmin && this.authService.getViewMode() === roleEnum.SuperAdmin)
      },
      {
        label: 'Recipes',
        icon: 'fa-solid fa-border-all',
        routerNavigate: '/dashboard/userPortal',
        isActive: this.isUser || (this.isSuperAdmin && this.authService.getViewMode() === roleEnum.SystemUser)
      },
      {
        label: 'Favorites',
        icon: 'fa-regular fa-heart',
        routerNavigate: '/dashboard/userPortal',
        isActive: this.isUser || (this.isSuperAdmin && this.authService.getViewMode() === roleEnum.SystemUser)
      }
    ];
  }

  onResize() {
    this.navbarUiService.setMobile(window.innerWidth <= 768);
  }

  toggleSidebar() {
    this.navbarUiService.toggleSidebar();
  }

  ngOnInit() {
    // Rebuild menu whenever viewMode changes
    this.authService.viewMode$
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.navMenu = this.buildMenu();
    });

    // Also rebuild menu on every navigation end
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.navMenu = this.buildMenu(); // triggers re-evaluation of isHomeActive
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
