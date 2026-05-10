import { Component, HostListener, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';
import { roleEnum } from '../core/enums/role.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private router = inject(Router);

  // ngOnInit(): void {
  //   const role = this.authService.getRole();

  //   if (role === roleEnum.SuperAdmin) {
  //     this.router.navigate(['/dashboard/admin']);
  //   } else if (role === 'SystemUser') {
  //     this.router.navigate(['/dashboard/userPortal']);
  //   }
  // }
}
