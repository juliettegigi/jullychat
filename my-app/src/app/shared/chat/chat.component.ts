import { Component,Input,inject,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MensajesComponent } from './mensajes/mensajes.component';
import { MenuInferiorComponent } from './menu-inferior/menu-inferior.component';
import { MenuSuperiorComponent } from './menu-superior/menu-superior.component';
import { User } from '../../core/models/user';
import { Mensaje } from '../../core/models/mensaje';
import { SocketService } from '../../core/services/socket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ CommonModule,MensajesComponent,MenuInferiorComponent,MenuSuperiorComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent  {
  @Input() usuarioReceptor:User|null=null;
  @Input() mensajes: Mensaje[] = [];
  @Input() idDelChat:number =0;
 
 private socketService = inject(SocketService);

  ngOnInit() {
  
  }


 
}
