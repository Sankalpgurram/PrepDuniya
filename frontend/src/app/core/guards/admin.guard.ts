import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserStateService } from '../services/user-state.service';

export const adminGuard: CanActivateFn = () => {
  const userState = inject(UserStateService);
  const router = inject(Router);

  if (userState.userProfile()?.role === 'admin') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
