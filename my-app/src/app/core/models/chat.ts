import { Mensaje } from "./mensaje";
import { User } from "./user";

export interface Chat {
    id:number,
    user1Id: number;
    user2Id: number;
    user1ClavaVisto: boolean;
    user2ClavaVisto: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  
  
  export interface RtaGetMsgCon {
    msg:string,
    chat: Chat;
    mensajes: Mensaje[]
  }
  
  export interface RtaPost {
    msg:string,
    chat: Chat
  }
  
  
  export interface ObjetoRtaGetAllChats {
   chat: Chat;
   otroUsuario:User | null;
   ultimoMensaje: Mensaje | null;
   createdAt:Date | null
  }
  export interface RtaGetAllChats {
    msg:string,
    chats: ObjetoRtaGetAllChats[]
  }


  export interface RtaPatchClavaVisto {
    msg:string;
    chat: Chat;
    userNum:number;
  }

