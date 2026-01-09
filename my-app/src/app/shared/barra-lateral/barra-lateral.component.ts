import { Component,inject, EventEmitter, Output,Input } from '@angular/core';
import { MenuBarraLateralComponent } from '../menu-barra-lateral/menu-barra-lateral.component';
import { ListaUsuariosComponent } from '../lista-usuarios/lista-usuarios.component';
import { RtaUsuariosEncontrados,User } from '../../core/models/user';
import { RtaGetMsgCon } from '../../core/models/chat';
import { Contacto, RtaPost } from '../../core/models/contacto';
import { ContactoApiService } from '../../core/services/api-contacto.service';
import { InputSearchComponent } from '../input-search/input-search.component';
import { ChatApiService } from '../../core/services/api-chat.service';
import { Chat,ObjetoRtaGetAllChats  } from '../../core/models/chat';
import { ListaMisContactosComponent } from '../lista-mis-contactos/lista-mis-contactos.component';
import { ListaChatsComponent } from '../lista-chats/lista-chats.component';
import { UserApiService } from '../../core/services/api-user.service';
import { Mensaje } from '../../core/models/mensaje';

@Component({
  selector: 'app-barra-lateral',
  standalone: true,
  imports: [MenuBarraLateralComponent, InputSearchComponent, ListaMisContactosComponent,
    ListaUsuariosComponent,ListaChatsComponent],
  templateUrl: './barra-lateral.component.html',
  styleUrl: './barra-lateral.component.css'
})
export class BarraLateralComponent {
 @Input() usuarioSeleccionado!: (chat: ObjetoRtaGetAllChats,index:number) => void;
 @Input() usuarioSeleccionadoParaNuevoChat!: (user: User) => void;
 @Input() chats: ObjetoRtaGetAllChats[] = [];
 @Input() currentBtnMenu:string="default"
 @Input() clickNuevoMsg!: ()=>void;
 @Input() clickAddContact!: ()=>void;
 @Input() agregarPersonaClick!: ()=>void;
 @Input() resultadosNewChat: User[] = [];
 @Input() idDelChat:number=0;
 
  vista='inicio'
  private contactoApi=inject(ContactoApiService)
  private chatApi=inject(ChatApiService)
  private userApi = inject(UserApiService);
    
    isInputSearchVisible = false;
    usuariosEncontrados: User[] = [];
    misContactos: Contacto[]=[];  
    contactosPorUserNameAndEmail: Contacto[]=[];  
    mensajesConUsuario:Mensaje[]=[]
 

    onClickInicio=()=>{
      this.currentBtnMenu="default";
    }

   // para enviarle a la lista-usuarios
  clickUsuario=(usuario:User)=>{
           // api para agregarContacto
            this.contactoApi.postContacto(usuario.id).subscribe({
              next:(rta:RtaPost)=>{
                },
                error: (err) => {
                  console.error(err);
              
                },
                complete: () => {
                }
            })
    }  


 
 

    onUsuariosEncontrados(rta: RtaUsuariosEncontrados) {
       this.usuariosEncontrados = rta.rows;
       }

   // para enviarle a la input-Search
    buscarChat=(termino:string)=>{
      this.chatApi.getChatsByMsgContacto(termino).subscribe({
           next:(chats:Chat[])=>{
             
           },
           error: (err) => {
             console.error(err);
         
           },
           complete: () => {
           }
       })
    }

  
    

    

    onClickNuevoContacto=()=>{
      this.currentBtnMenu="nuevoContacto"
    }

    // recibo la lista de usuarios encontrados del input-search
    onUsuariosEncontradosNuevoContacto=(usuarios:User[])=>{
    }

    
    
    
   
    buscarUsuario = (termino: string) => {
                 if (!termino) {
                   this.resultadosNewChat = [];
                   return;
                 }
             
                 this.userApi.getByUserNameAndEmail(termino).subscribe({
                   next: (data: any) => {
                     this.resultadosNewChat = data.usuarios || data;
                   },
                   error: (err) => {
                     console.error('Error al buscar usuario:', err);
                     this.resultadosNewChat = [];
                   }
                 });
      };


      // le envío a la lista usuario la función para agregar contacto
     agregarContacto=(user: User)=> {
        // llamo a la API , que agrega al contacto a la DB
        this.contactoApi.postContacto(user.id).subscribe({
          next: (rta: RtaPost) => {
            this.currentBtnMenu="defaulty";
            this.usuarioSeleccionadoParaNuevoChat(user);
            // actualizo al usr seleccionado
          //  this.usuarioSeleccionadParaNuevoChat.emit(user);
            
          

          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
          }
        });
      }

 // le envío a la lista usuario la función para cuando hagan click en un li
      clickLiNuevoMsg=(user:User)=>{
        // le emito al componente padre para que cargue al componente ChatComponent con el chat entre ambos, los mensajes" y que cargue al componente "BarraLateral" con la lista de contactos con las que tuve un chat
       this.usuarioSeleccionadoParaNuevoChat(user);

      }

      onClickChatConUsuario=(chat: ObjetoRtaGetAllChats,index:number)=>{
        // le emito al componente padre para que cargue al componente ChatComponent con el chat entre ambos, los mensajes" y que cargue al componente "BarraLateral" con la lista de contactos con las que tuve un chat
       this.currentBtnMenu="default"
       this.usuarioSeleccionado(chat,index);

      }
}
