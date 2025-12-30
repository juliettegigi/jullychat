import { User } from "./user";

export interface Contacto {
  id:number;
    emisorId: number;
    receptorId: number;
    contenido: string;
    misContactos:User[];
  }




  export interface RtaPost {
    
    msg: string;
  }
  
 /*  export interface RtaGetMisContactos {
    
    msg: string;
    contactos: Contacto[];
  }
 */