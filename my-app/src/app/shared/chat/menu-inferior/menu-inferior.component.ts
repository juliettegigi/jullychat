import { Component,Input,inject, Output,EventEmitter } from '@angular/core';
import { Chat,RtaPost } from '../../../core/models/chat';
import { SocketService } from '../../../core/services/socket.service';
import { ChatApiService } from '../../../core/services/api-chat.service';
import { Mensaje } from '../../../core/models/mensaje';
@Component({
  selector: 'app-menu-inferior',
  imports: [],
  templateUrl: './menu-inferior.component.html',
  styleUrl: './menu-inferior.component.css'
})
export class MenuInferiorComponent {
 @Input() idDelChat!: number;
  @Input() user2Id: number | undefined = undefined;

  private chatApi=inject(ChatApiService)
  private socketService = inject(SocketService);
  textoDelMensaje: string="";

  enviarMensaje(editor: HTMLElement) {
         console.log('click en enviar');
         console.log("id del chat -->",this.idDelChat)
         // si no existe el chat, primero lo creo
         if (!this.idDelChat) {
           this.chatApi.postChat(this.user2Id ?? 0).subscribe({
             next: (rta: RtaPost) => {
               console.log("CHAT CREADO:", rta);
       
               // ahora sí ya tengo idDelChat
               this.idDelChat = rta.chat.id;
       
               // emitir mensaje recién ahora
               this.enviarMensajeSocket();
       
               // limpiar
               editor.innerText = "";
               this.textoDelMensaje = "";
             },
             error: (err) => console.error("ERROR POST:", err)
           });
       
           return; // 🛑 importante para no seguir abajo
         }
       
         // ya existe el chat
         this.enviarMensajeSocket();
       
         editor.innerText = "";
         this.textoDelMensaje = "";
}











private enviarMensajeSocket() {
  console.log("Id del chat en menu inferior: ",this.idDelChat)
  this.socketService.emit("mensajeEmisor", 
    {ChatId: this.idDelChat,
    contenido: this.textoDelMensaje},
);
}


onInput(text: string) {
  this.textoDelMensaje = text;
}
}
