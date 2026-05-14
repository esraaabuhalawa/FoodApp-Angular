import { CanActivateFn, Router } from '@angular/router';
import { roleEnum } from '../enums/role.enum';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if(localStorage.getItem('userRole') === roleEnum.SuperAdmin){
    return true
  } else {
    router.navigate(['/dashboard'])
    return false
  }
};
