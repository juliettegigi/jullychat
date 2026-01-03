import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AuthService {

     saveSession(user: any, token: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  
  get user() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  get userId(): number | null {
    return this.user?.id ?? null;
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
  }
}
