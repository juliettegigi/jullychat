import { Component,Input,inject } from '@angular/core';
import { DatePipe,CommonModule } from '@angular/common';
import { Mensaje } from '../../../core/models/mensaje';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-mensajes',
  imports: [DatePipe,CommonModule],
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.css'
})
export class MensajesComponent {
   @Input() mensajes: Mensaje[] = [];
public authService = inject(AuthService);

ngOnInit() {
    console.log("AUTHSERVIUVCWW ")
console.log(this.authService.userId)
  }
}
