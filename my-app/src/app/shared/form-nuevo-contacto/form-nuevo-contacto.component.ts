import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../core/services/api-user.service';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-form-nuevo-contacto',
  standalone: true,
   imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './form-nuevo-contacto.component.html',
  styleUrl: './form-nuevo-contacto.component.css'
})

export class FormNuevoContactoComponent {
  private fb = inject(FormBuilder);
  private userApi = inject(UserApiService);

  formContacto: FormGroup = this.fb.group({ termino: ['', [Validators.required]], // userName o email
                                            alias: ['']
                                          });

  resultados: User[] = [];
  buscando = false;

  buscarUsuario() {
    if (this.formContacto.invalid) return;

    const termino = this.formContacto.get('termino')?.value;
    this.buscando = true;
    this.resultados = [];

    this.userApi.getByUserNameAndEmail(termino).subscribe({
      next: (rta:any ) => {
        this.resultados = rta.usuarios;
        console.log('Usuarios encontrados:', this.resultados);
        this.buscando = false;
      },
      error: (err) => {
        console.error('Error buscando usuario:', err);
        this.buscando = false;
      }
    });
  }

  agregarContacto(user: User) {
    const alias = this.formContacto.get('alias')?.value || null;

    console.log('Agregar contacto:', {
      contactoId: user.id,
      alias
    });

    // Llamada a tu API para guardar el contacto
  }
}