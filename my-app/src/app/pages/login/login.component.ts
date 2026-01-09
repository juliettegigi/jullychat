import {
  Component,
  inject,
  AfterViewInit,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { UserApiService } from '../../core/services/api-user.service';
import { AuthService } from '../../core/services/auth.service';
import { SocketService } from '../../core/services/socket.service';
import { environment } from '../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  loginForm: FormGroup;
  loginError: string | null = null;
  loading = false;

  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  private api = inject(UserApiService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private socketService = inject(SocketService);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // ✅ ACÁ va Google
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!(window as any).google) {
      console.warn('Google script no cargado');
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      {
        theme: 'outline',
        size: 'large',
        text: 'sign_in_with'
      }
    );

    // 👇 ESTO DISPARA LA VENTANITA
     google.accounts.id.prompt();
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.loginError = null;

    const { email, pass } = this.loginForm.value;

    this.api.login(email, pass).subscribe({
      next: (rta) => {
        this.loading = false;
        this.authService.saveSession(rta.user, rta.token);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.loading = false;
        this.loginError = 'Usuario o contraseña incorrectos';
      }
    });
  }

  handleCredentialResponse(response: any) {
    const id_token = response.credential;

    this.api.loginWithGoogle(id_token).subscribe({
      next: (res: any) => {
        this.authService.saveSession(res.user, res.token);
        // this.socketService.connect();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loginError = 'Error al iniciar sesión con Google';
        console.error(err);
      }
    });
  }
}
