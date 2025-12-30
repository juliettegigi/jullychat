import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { EmptyComponent } from './pages/empty/empty.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: '',component: LoginComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];