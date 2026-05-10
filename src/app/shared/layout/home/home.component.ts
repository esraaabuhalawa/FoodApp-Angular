import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { roleEnum } from 'src/app/core/enums/role.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private authService = inject(AuthService);
  userData$ = this.authService.userData$;
  currentViewMode$ = this.authService.viewMode$;

  get isSuperAdmin(): boolean {
    return this.authService.getRole() === 'SuperAdmin';
  }

  get isUser(): boolean {
    return this.authService.getRole() === 'SystemUser';
  }

  recipeLink(): string {
    if (this.isSuperAdmin && this.authService.getViewMode() === roleEnum.SuperAdmin) {
      return '/dashboard/admin/recipes';
    } else if ( this.isSuperAdmin && this.authService.getViewMode() === roleEnum.SystemUser ) {
      return '/dashboard/userPortal/user-recipes';
    } else {
      return '/dashboard/userPortal/user-recipes';
    }
  }
}
