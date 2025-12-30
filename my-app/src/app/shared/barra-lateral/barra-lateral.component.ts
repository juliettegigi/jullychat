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
 @Output() usuarioSeleccionado = new EventEmitter<User>();
 @Input() chats: ObjetoRtaGetAllChats[] = [];

  vista='inicio'
  currentBtnMenu="default"
  private contactoApi=inject(ContactoApiService)
  private chatApi=inject(ChatApiService)
  private userApi = inject(UserApiService);
    
    isInputSearchVisible = false;
    usuariosEncontrados: User[] = [];
    misContactos: Contacto[]=[];  
    contactosPorUserNameAndEmail: Contacto[]=[];  
    mensajesConUsuario:Mensaje[]=[]
 


   // para enviarle a la lista-usuarios
  clickUsuario=(usuario:User)=>{
           console.log('Usuario clickeado:', usuario);
           // api para agregarContacto
            this.contactoApi.postContacto(usuario.id).subscribe({
              next:(rta:RtaPost)=>{
                  console.log(rta.msg);
                },
                error: (err) => {
                  console.error(err);
              
                },
                complete: () => {
                  console.log("Petición terminada");
                }
            })
    }  


 
 

    onUsuariosEncontrados(rta: RtaUsuariosEncontrados) {
      console.log("quweeeeeeeeeeeeeeeee")
      console.log(rta)
      this.usuariosEncontrados = rta.rows;
      console.log('Usuarios encontrados en BarraLateralComponent:', this.usuariosEncontrados);
    }

   // para enviarle a la input-Search
    buscarChat=(termino:string)=>{
       console.log("me ejecutooo")
      this.chatApi.getChatsByMsgContacto(termino).subscribe({
           next:(chats:Chat[])=>{
             
             console.log('contactos recibidos en BarraLateralComponent:', chats);
           },
           error: (err) => {
             console.error(err);
         
           },
           complete: () => {
             console.log("Petición terminada");
           }
       })
    }

    // para enviarle a la menu-barra-lateral
    onClickNuevoMensaje=()=>{
        this.currentBtnMenu="nuevoMsg"
        this.contactoApi.getMisContactos().subscribe({
                   next: (rta: User[]) => {
                   
                     console.log('Resultados:', rta);
                     this.resultados=rta;
                   },
                   error: (err) => {
                     console.error('Error al buscar usuario:', err);
                     this.resultados = [];
                   }
                 });
    }

    

    onClickInicio=()=>{
      console.log("q carajuss")
      this.vista="inicio"
    }

    onClickNuevoContacto=()=>{
      console.log("q carajuss")
      this.currentBtnMenu="nuevoContacto"
    }

    // recibo la lista de usuarios encontrados del input-search
    onUsuariosEncontradosNuevoContacto=(usuarios:User[])=>{
    }

    
    
    
    // le envío al inputSearch la función para buscar usuarios
    resultados: any[] = [];
    buscarUsuario = (termino: string) => {
                 console.log('Buscando:', termino);
                 if (!termino) {
                   this.resultados = [];
                   return;
                 }
             
                 this.userApi.getByUserNameAndEmail(termino).subscribe({
                   next: (data: any) => {
                     this.resultados = data.usuarios || data;
                     console.log('Resultados:', this.resultados);
                   },
                   error: (err) => {
                     console.error('Error al buscar usuario:', err);
                     this.resultados = [];
                   }
                 });
      };


      // le envío a la lista usuario la función para agregar contacto
     agregarContacto=(user: User)=> {
        console.log('Agregar usuario:', user);
        // acá después llamás otra API si querés
        this.contactoApi.postContacto(user.id).subscribe({
          next: (rta: RtaPost) => {
            console.log(rta.msg);
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            console.log("Petición terminada");
          }
        });
      }

 // le envío a la lista usuario la función para cuando hagan click en un li
      clickLiNuevoMsg=(user: User)=>{
        console.log('Usuario clickeado para nuevo mensaje:', user);
        // le emito al componente padre para que cargue al componente ChatComponent con el chat entre ambos, los mensajes" y que cargue al componente "BarraLateral" con la lista de contactos con las que tuve un chat
        this.usuarioSeleccionado.emit(user);

      }

      onClickChatConUsuario=(user: User)=>{
        console.log('chatClickeado:', user);
        // le emito al componente padre para que cargue al componente ChatComponent con el chat entre ambos, los mensajes" y que cargue al componente "BarraLateral" con la lista de contactos con las que tuve un chat
        this.usuarioSeleccionado.emit(user);

      }
}
