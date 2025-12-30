import { Mensaje } from "./mensaje";
import { User } from "./user";

export interface Chat {
    id:number,
    user1Id: number;
    user2Id: number;
  }

  
  
  export interface RtaGetMsgCon {
    msg:string,
    chat: Chat;
    mensajes: Mensaje[];
  }
  
  export interface RtaPost {
    msg:string,
    chat: Chat;
  }
  
  
  export interface ObjetoRtaGetAllChats {
   chatId: number;
   otroUsuario:User;
   ultimoMensaje: string | null;
   isRead:boolean;
   fecha:string | null; 
  }
  export interface RtaGetAllChats {
    msg:string,
    chats: ObjetoRtaGetAllChats[];
  }



