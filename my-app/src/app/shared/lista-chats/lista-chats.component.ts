import { Component, Input } from '@angular/core';
import { Chat,ObjetoRtaGetAllChats  } from '../../core/models/chat';
import { DatePipe , NgClass} from '@angular/common';
@Component({
  selector: 'app-lista-chats',
  imports: [DatePipe,NgClass],
  templateUrl: './lista-chats.component.html',
  styleUrl: './lista-chats.component.css'
})
export class ListaChatsComponent {
//recibo los chats
  @Input() chats : ObjetoRtaGetAllChats[] = [];
  // recibo la funcion cuando le hacen click a un li
  @Input() clickLi ?:(chat:ObjetoRtaGetAllChats)=>void;
}
