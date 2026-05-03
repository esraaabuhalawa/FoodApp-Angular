import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

export const redirectGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const userGroup = authService.getRole();

  if (userGroup === 'SuperAdmin') {
    router.navigate(['/dashboard/admin']);
  } else if (userGroup === 'SystemUser') {
    router.navigate(['/dashboard/userPortal']);
  } else {
    router.navigate(['/auth/login']);
  }

  return false;
};
