import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // ✅ Verificamos que estamos en el navegador
  const isBrowser =
    typeof window !== 'undefined' &&
    typeof localStorage !== 'undefined';

  if (isBrowser) {
    const token = localStorage.getItem('token');
    if (token) return true;

    // ✅ Solo navegamos si estamos en navegador
    router.navigate(['/']);
  }

  // ✅ Durante prerender no intentamos navegar
  return false;
};