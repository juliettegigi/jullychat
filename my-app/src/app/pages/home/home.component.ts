import { Component,inject,NgZone, ɵclearResolutionOfComponentResourcesQueue} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../shared/menu/menu.component';
import { BarraLateralComponent } from '../../shared/barra-lateral/barra-lateral.component';
import { ChatComponent } from '../../shared/chat/chat.component';
import { User } from '../../core/models/user';
import { Mensaje } from '../../core/models/mensaje';
import { Chat } from '../../core/models/chat';
import { ObjetoRtaGetAllChats} from '../../core/models/chat';
import { ChatApiService } from '../../core/services/api-chat.service';
import { RtaGetMsgCon } from '../../core/models/chat';
import { SocketService } from '../../core/services/socket.service';
import { authGuard } from '../../core/guards/auth.guard';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
   standalone: true,
  imports: [CommonModule,MenuComponent,BarraLateralComponent,ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

    usuarioSeleccionado: User | null = null;
    usuarioSeleccionadoId: number  = 0;
    private zone = inject(NgZone);
    private destroy$ = new Subject<void>();
    //reciboMensajeDeId: number = 0;
    mensajes: Mensaje[] = [];
    idDelChat:number =0;
    chats: ObjetoRtaGetAllChats[] = [];
    private chatApi=inject(ChatApiService)
    private socketService = inject(SocketService);
    private AuthService = inject(AuthService);
    emisorId=this.AuthService.user?.id;
  
  private actualizarChats(nuevoMensaje: Mensaje, chatId: number) {
  const idx = this.chats.findIndex(c => c.chatId === chatId);

  if (idx !== -1) {
    const chat = this.chats[idx];

    const chatActualizado = {
      ...chat,
      ultimoMensaje: nuevoMensaje,
      chatId: chatId,
      otroUsuario: chat.otroUsuario,
      createdAt: nuevoMensaje.createdAt,
      isRead: this.idDelChat === chatId
    };

    // lo saco de su lugar
    this.chats.splice(idx, 1);

    // lo pongo arriba
    this.chats.unshift(chatActualizado);
  }
}
    ngOnInit() {

      

      this.socketService.connect();

      
     this.chatApi.getAllChats().subscribe({
            next: (res) => {
              console.log("LPMMMMMMMMMMMMMMMMM")
              console.log(res)
              this.chats = res.chats;  // ← acá sí es un array
            },
            error: (err) => console.error(err)
      });

   

    this.socketService.listen<{ nuevoMensaje: Mensaje; chat:Chat }>('mensajeReceptor')
     .pipe(takeUntil(this.destroy$))    
     .subscribe(({ nuevoMensaje, chat}) => {
          console.log("recibo mensaje")
          console.log("this.usuario seleccionado: ",this.usuarioSeleccionado)
          console.log("ChatId: ",chat.id)
          // si el mensaje es del chat que tengo abierto, lo agrego a la lista de mensajes
          if(this.usuarioSeleccionado && 
            (this.usuarioSeleccionadoId === chat.user1Id
              || this.usuarioSeleccionadoId === chat.user2Id) ){
           console.log("es del chat abierto")
          
         
            this.zone.run(() => {
            this.mensajes.push(nuevoMensaje);
          });}
        
         this.actualizarChats(nuevoMensaje, chat.id);
        });


  }

  ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
   



onUsuarioSeleccionado(chat:ObjetoRtaGetAllChats) {
    console.log("entrooooooooooooooooooo")
    // tenho el usuario con el que se está chateando
    this.usuarioSeleccionado=chat.otroUsuario;
    this.usuarioSeleccionadoId=chat.otroUsuario.id
    chat.isRead=true; // marco como leido el chat en la lista de chats
    this.chatApi.getMsgCon(this.usuarioSeleccionadoId).subscribe({
               next:(rta:RtaGetMsgCon)=>{
                 console.log('RTA', rta);
                 if(rta.chat){
                  //hacer un update del chat
                  this.chatApi.patchIsRead(chat.chatId).subscribe({
                      next: () => {
                        chat.isRead = true; // optimista
                      },
                      error: err => {
                        console.error('No se pudo marcar como leído', err);
                      }
                    });

                  this.mensajes=rta.mensajes
                  console.log("Mensajes --->  ")
                  console.log(rta.mensajes)
                  this.idDelChat=rta.chat.id
                 }
                 else this.idDelChat=0
               },
               error: (err) => {
                 console.error(err);
                switch(err.status){
                  case 0:
                    alert('Error de conexión con el servidor. Por favor, inténtelo más tarde.');
                    break;
                  case 400:
                    alert('Solicitud incorrecta. No se encuantra el id del usuario con el que se quiere chatear.');
                    break;  
                  case 404:
                    alert('No se encontró el chat solicitado.');
                    break;
                  default:
                    alert('Ocurrió un error inesperado. Por favor, inténtelo más tarde.');
                }
                    
               },
               complete: () => {
                 console.log("Petición terminada");
               }
           })

    
  }

  onUsuarioSeleccionadoParaNuevoChat(user:User) {
    console.log("entrooooooooooooooooooo222")
    // tenho el usuario con el que se está chateando
    this.usuarioSeleccionado=user;
    this.usuarioSeleccionadoId=user.id
   this.chatApi.getMsgCon(this.usuarioSeleccionadoId).subscribe({
               next:(rta:RtaGetMsgCon)=>{
                 console.log('RTA', rta);
                 if(rta.chat){
                  this.mensajes=rta.mensajes
                  console.log("Mensajes --->  ")
                  console.log(rta.mensajes)
                  this.idDelChat=rta.chat.id
                  // marco al chat como leido
                  this.chatApi.patchIsRead(rta.chat.id).subscribe({
                      next: () => {

                      },
                      error: err => {
                        console.error('No se pudo marcar como leído', err);
                      }
                    });
                 }
                 else this.idDelChat=0
               },
               error: (err) => {
                 console.error(err);
                switch(err.status){
                  case 0:
                    alert('Error de conexión con el servidor. Por favor, inténtelo más tarde.');
                    break;
                  case 400:
                    alert('Solicitud incorrecta. No se encuantra el id del usuario con el que se quiere chatear.');
                    break;  
                  case 404:
                    alert('No se encontró el chat solicitado.');
                    break;
                  default:
                    alert('Ocurrió un error inesperado. Por favor, inténtelo más tarde.');
                }
                    
               },
               complete: () => {
                 console.log("Petición terminada");
               }
           })

    
  }


  
}
