
import { Component, inject, OnInit,PLATFORM_ID  } from '@angular/core';
import { CommonModule,isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserApiService } from '../../core/services/api-user.service';
import { Router } from '@angular/router';
import { SocketService } from '../../core/services/socket.service';
import{AuthService} from '../../core/services/auth.service';
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
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginError: string | null = null;
  loading = false;

  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  private authService=inject(AuthService);
  private api = inject(UserApiService);
  private router = inject(Router);
  private socketService = inject(SocketService);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

ngOnInit(): void {
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
    document.getElementById('google-signin-button')!,
    { theme: 'outline', size: 'large', width: 300 }
  );
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
        //this.socketService.connect();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loginError = 'Error al iniciar sesión con Google';
        console.error(err);
      }
    });
  }
}
