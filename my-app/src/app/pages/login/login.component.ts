import { Component,inject } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button'; 
import { UserApiService } from '../../core/services/api-user.service';
import { Router } from '@angular/router'; 
import { SocketService } from '../../core/services/socket.service';

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
export class LoginComponent{   
  loginForm: FormGroup; 
  loginError: string | null = null; 
  loading: boolean = false; 

  private fb = inject(FormBuilder);
  private api = inject(UserApiService);
  private router = inject(Router);
  private socketService = inject(SocketService);


  constructor() { 
     // inicialización del formulario
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]],
    });   
  } 

  

  onSubmit() { 
    if (this.loginForm.valid) { 
      this.loginError = null; 
      this.loading = true; 
      const { email, password } = this.loginForm.value; 
       
     
 
    this.api.login(email, password).subscribe({ //asi se ejecuta la petición, lo qw está definido en el observable, el observable me emite la rta del backend
      next: (rta) => {
        this.loading = false;
        console.log('✅ Login correcto:', rta);
          // 🔹 Guardar token en el local storage
        localStorage.setItem('token', rta.token);
        this.socketService.connect();
        this.router.navigate(['/home']); // redirigir
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.loginError = 'Usuario o contraseña incorrectos';
      },
      complete: () => {
         console.log("Petición terminada");
    }
    });

    } 
  } 
}


