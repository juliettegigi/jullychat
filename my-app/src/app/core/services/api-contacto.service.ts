import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment'
import { RtaPost,Contacto} from '../models/contacto';
import { User } from '../models/user';
//import { getApiUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ContactoApiService {
 // private platformId = inject(PLATFORM_ID);
  //private API_URL = getApiUrl(this.platformId);
  private apiUrl = `${environment.apiUrl}/api/contactos/`;
  private http =inject(HttpClient)


  
  postContacto(contactoId:number): Observable<RtaPost> {  // este observable me emite la rta del backend
    return this.http.post<RtaPost>(`${this.apiUrl}`,{contactoId});
  }
  getContactos(): Observable<Contacto[]> {  // este observable me emite la rta del backend
    return this.http.get<Contacto[]>(`${this.apiUrl}all`);
  }
  getContactosGetContactosPorUserNameAndEmail(): Observable<Contacto[]> {  // este observable me emite la rta del backend
    return this.http.get<Contacto[]>(`${this.apiUrl}porUserNameAndEmail`);
  }

  // recibo {}
  getMisContactos(): Observable<User[]> { 
    return this.http.get<User[]>(`${this.apiUrl}misContactos`);
  }

  
  
}
