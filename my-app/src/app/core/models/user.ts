export interface User {
    id: number;
    userName: string;
    email: string;
    avatar:string;
  }

export interface rtaLogin { // no importa q el backend mande mas datos, solo me interesa estos
    user:User;
    token: string;
  }


  // para rta de evento sockets
  export interface RtaUsuariosEncontrados { // no importa q el backend mande mas datos, solo me interesa estos
    count:number;
    rows: User[];
  }


  export interface GetUserByIdResponse {
  msg: string;
  user: User;
}