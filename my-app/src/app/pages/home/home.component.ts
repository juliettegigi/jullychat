import { Component,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../shared/menu/menu.component';
import { BarraLateralComponent } from '../../shared/barra-lateral/barra-lateral.component';
import { ChatComponent } from '../../shared/chat/chat.component';
import { User } from '../../core/models/user';
import { Mensaje } from '../../core/models/mensaje';
import { ObjetoRtaGetAllChats} from '../../core/models/chat';
import { ChatApiService } from '../../core/services/api-chat.service';
import { RtaGetMsgCon } from '../../core/models/chat';
import { SocketService } from '../../core/services/socket.service';

@Component({
  selector: 'app-home',
   standalone: true,
  imports: [CommonModule,MenuComponent,BarraLateralComponent,ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    usuarioSeleccionado: User | null = null;
    usuarioSeleccionadoId: number  = 0;
    mensajes: Mensaje[] = [];
    idDelChat:number =0;
    chats: ObjetoRtaGetAllChats[] = [];
    private chatApi=inject(ChatApiService)
    private socketService = inject(SocketService);
  
  
    ngOnInit() {

     this.chatApi.getAllChats().subscribe({
            next: (res) => {
              console.log("LPMMMMMMMMMMMMMMMMM")
              console.log(res)
              this.chats = res.chats;  // ← acá sí es un array
            },
            error: (err) => console.error(err)
      });

   

    this.socketService.listen<Mensaje>('mensajeReceptor')
        .subscribe(mensaje => {
          console.log("recibo mensaje")
          this.mensajes.push(mensaje);
        });


  }
   onUsuarioSeleccionado(user: User) {
    console.log('Usuario recibido en HomeComponent:', user);
    this.usuarioSeleccionado=user;
    this.usuarioSeleccionadoId=user.id
    this.chatApi.getMsgCon(user.id).subscribe({
               next:(rta:RtaGetMsgCon)=>{
                 console.log('RTA', rta.msg);
                 if(rta.chat){
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


  
}
