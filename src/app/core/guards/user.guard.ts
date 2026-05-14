import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { roleEnum } from '../enums/role.enum';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
    if(localStorage.getItem('userRole') === roleEnum.SystemUser){
      return true
    } else {
      router.navigate(['/dashboard'])
      return false
    }
};
