import { Component,Input,inject, Output,EventEmitter } from '@angular/core';
import { Chat,RtaPost } from '../../../core/models/chat';
import { SocketService } from '../../../core/services/socket.service';
import { ChatApiService } from '../../../core/services/api-chat.service';
import { Mensaje } from '../../../core/models/mensaje';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-menu-inferior',
  imports: [],
  templateUrl: './menu-inferior.component.html',
  styleUrl: './menu-inferior.component.css'
})
export class MenuInferiorComponent {
 @Input() idDelChat!: number;
  @Input() user2Id: number | undefined = undefined;// es el usuario receptor

  private chatApi=inject(ChatApiService)
  private socketService = inject(SocketService);
  private authService = inject(AuthService);

  textoDelMensaje: string="";

  enviarMensaje(editor: HTMLElement) {
         
       
         // ya existe el chat
         this.enviarMensajeSocket();
       
         editor.innerText = "";
         this.textoDelMensaje = "";
}










private enviarMensajeSocket() {
  this.socketService.emit("mensajeEmisor", 
    {ChatId: this.idDelChat,
    contenido: this.textoDelMensaje,
    user2Id: this.user2Id,
   },
);
}


onInput(text: string) {
  this.textoDelMensaje = text;
}
}
