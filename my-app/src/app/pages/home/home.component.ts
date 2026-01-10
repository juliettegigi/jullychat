import { Component,inject,NgZone} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../shared/menu/menu.component';
import { BarraLateralComponent } from '../../shared/barra-lateral/barra-lateral.component';
import { ChatComponent } from '../../shared/chat/chat.component';
import { User, RtaUsuariosEncontrados } from '../../core/models/user';
import { Mensaje } from '../../core/models/mensaje';
import { Chat, RtaPatchClavaVisto } from '../../core/models/chat';
import { ObjetoRtaGetAllChats} from '../../core/models/chat';
import { ChatApiService } from '../../core/services/api-chat.service';
import { RtaGetMsgCon } from '../../core/models/chat';
import { SocketService } from '../../core/services/socket.service';
import { ContactoApiService } from '../../core/services/api-contacto.service';
import { AuthService } from '../../core/services/auth.service';
import { UserApiService } from '../../core/services/api-user.service';
import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
   standalone: true,
  imports: [CommonModule,MenuComponent,BarraLateralComponent,ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

 
    private contactoApi=inject(ContactoApiService)
    private userApi=inject(UserApiService)
    private AuthService = inject(AuthService);
    emisorId=this.AuthService.user?.id;//el usuario logueado
    currentBtnMenu:string="default"//lo que se muestra enn la barra lateral, por default la lista de chats
    usuarioSeleccionado: User | null = null;
    usuarioSeleccionadoId?: number  = 0;
    usuarioSeleccionadoIndex:number=0;
    //reciboMensajeDeId: number = 0;
    mensajes: Mensaje[] = [];//mensajes del chat abierto
    idDelChat:number =0; //id del chat abierto
    chats: ObjetoRtaGetAllChats[] = [];// los chats de la barra lateral
    resultadosNewChat: User[] = [];// resultados de la búsqueda de usuarios para nuevo chat
    private chatApi=inject(ChatApiService)
    private socketService = inject(SocketService);
    private destroy$ = new Subject<void>();
    private zone = inject(NgZone); // porque las cosas no se actualizan cuando uso sockets
    contraer=false;
    usuarioLogueado=this.AuthService.user || null;
    isMobile = false;

    restore=()=>{
      this.usuarioSeleccionado=null;
      this.usuarioSeleccionadoId=0 
      this.mensajes=[];
      this.idDelChat=0;
      this.contraer=false; 
    }
    
      constructor(private breakpointObserver: BreakpointObserver) {
        this.breakpointObserver
          .observe('(max-width: 768px)')
          .subscribe(result => {
            this.isMobile = result.matches;
          });
      }

  

      actualizarChats = (chat: ObjetoRtaGetAllChats, isEmisor:boolean) => {
        //si yo selecciono y soy el emisor del nuevo mensaje
        if(isEmisor){
               if(this.idDelChat!==0){
                   //elimino el chat para ponerlo arriba
                   this.chats.splice(this.usuarioSeleccionadoIndex, 1);
                   this.usuarioSeleccionadoIndex=0;
               }
          this.chats.unshift(chat);
        return;  
        }

        // 🔹 Buscar índice del chat en la lista
        const index = this.chats.findIndex(c => c.chat.id === chat.chat.id);
        // 🔹 Si existe, lo quitamos de su posición actual
        if (index !== -1) {
          this.chats.splice(index, 1);
        }
        // 🔹 Lo insertamos al principio
        this.chats.unshift(chat);

      };
    ngOnInit() {

      

      this.socketService.connect();

      
     this.chatApi.getAllChats().subscribe({
            next: (res) => {
              
              this.chats = res.chats;  // ← acá sí es un array
            },
            error: (err) => console.error(err)
      });

   






this.socketService.listen<{ nuevoMensaje: Mensaje; chat:Chat,emisor:User,receptor:User }>('mensajeReceptor')
     .pipe(takeUntil(this.destroy$))
     .subscribe(  ({ nuevoMensaje, chat, emisor,receptor}) => {
      
      // usuarioSeleccionado son distintos en ambos navegadores, 
      // idDelChatTambien, uno puede tener un chat abierto y otro otro
                

                let otroUsuario=null;
                //
                otroUsuario= this.usuarioLogueado.id===emisor.id?receptor:emisor;

             this.actualizarChats({  chat,
               otroUsuario,
               ultimoMensaje:nuevoMensaje,
               createdAt: nuevoMensaje.createdAt},emisor.id===this.usuarioLogueado.id)
        
              // cuando alguien envía msj a un usuario con el cual no tenía chat creado, o sea, se creó un nuevo chat
              if(this.idDelChat === 0 ){
                       this.idDelChat=chat.id;
                       // acá insertar al principio de thischats
                       
              } 
                 //  eliminar al chat de this,chats e insertarlo  al principio del this.chats}
                      // si el mensaje es del chat que tengo abierto, lo agrego a la lista de mensajes
                      if( chat.id==this.idDelChat ){
                        this.zone.run(  () => {  this.mensajes.push(nuevoMensaje);
                                                  // si yo tengo abierto el chat, entonces tengo que marcar al nuevo mensaje como visto
                                                 // el nuevo mensaje el socket ya lo marca como visto por el q envía el mensaje ==> hay q ver si el receptor tiene el chat abierto para ponerle visto
                                                 if(this.emisorId!==emisor.id){
                                                         //hacer un update del chat
                                                         this.chatApi.patchClavaVisto(chat.id,this.emisorId).subscribe({
                                                                 next: (resp:RtaPatchClavaVisto) => {
                                                                               this.chats[this.usuarioSeleccionadoIndex].chat=resp.chat;
                                                                      },
                                                                 error: (err) => {
                                                                             console.error('❌ Error al clavar visto', err);
                                                                           }
                                                         });
                                                   }
                                              }
                                      );
                       }
                
                

                
        } );




  


} //ngOnInit

  ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
   



onUsuarioSeleccionado=(chat:ObjetoRtaGetAllChats,index:number) => {
    // tenho el usuario con el que se está chateando
    this.usuarioSeleccionado=chat.otroUsuario;
    this.usuarioSeleccionadoId=chat.otroUsuario?chat.otroUsuario.id:0;
    this.usuarioSeleccionadoIndex=index;
    this.chatApi.getMsgCon(this.usuarioSeleccionadoId).subscribe({
               next:(rta:RtaGetMsgCon)=>{ //msg:string y chat: Chat y mensajes: Mensaje[]
                 
                if(rta.chat){
                  //hacer un update del chat
                   this.chatApi.patchClavaVisto(rta.chat.id, this.AuthService.userId || 0).subscribe({
                       next: (resp:RtaPatchClavaVisto) => {
                         this.chats[index].chat=resp.chat;
                         
                       },
                       error: (err) => {
                         console.error('❌ Error al clavar visto', err);
                       }
                     });
                  this.mensajes=rta.mensajes
                  this.idDelChat=rta.chat.id
                 

                 }
                 else {
                  this.idDelChat=0;

                 }
                 if(this.isMobile) {
                  this.contraer=true;
                 }

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
               }
           }) 

    
  }

  onUsuarioSeleccionadoParaNuevoChat=(user:User)=> {
    // tenho el usuario con el que se está chateand
    this.usuarioSeleccionado=user;
    this.usuarioSeleccionadoId=user.id
    this.currentBtnMenu="dsd"
    //cargo los mensajes entre el emisor y el receptor
   this.chatApi.getMsgCon(this.usuarioSeleccionadoId).subscribe({
               next:(rta:RtaGetMsgCon)=>{
                //agrego a un contacto=> puede o no existir chat, no mas lo agrego a la lista de mis contactos
                //si existe chat entre los dos usuarios
                 if(rta.chat){
                  this.idDelChat=rta.chat.id
                  // marco al último mensaje como leído 
                  
                 }
                 else {
                  if(this.isMobile) 
                    this.contraer=true; //indica que es un nuevo chat
                  else this.idDelChat=0; 

                }
                this.mensajes=rta.mensajes
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
               }
           })

    
  }

clickNuevoMsg=()=>{
  this.currentBtnMenu="nuevoMsg" 
  this.contactoApi.getMisContactos().subscribe({
                   next: (rta: User[]) => {
                     this.resultadosNewChat=rta;
                   },
                   error: (err) => {
                     console.error('Error al buscar usuario:', err);
                     this.resultadosNewChat = [];
                   }
                 });
}
  clickAddContact=()=>{
  this.currentBtnMenu="addContact" 
}
}
