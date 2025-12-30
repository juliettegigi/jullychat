import { Injectable,inject, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  Mensaje } from '../models/mensaje';
import { getApiUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class MensajeApiService {
  private platformId = inject(PLATFORM_ID);
  private API_URL = getApiUrl(this.platformId);
  private apiUrl = `${this.API_URL}/api/mensajes/`;
  private http =inject(HttpClient)


  // Iniciar sesión
  getMensajes(): Observable<Mensaje[]> {  // este observable me emite la rta del backend
    return this.http.get<Mensaje[]>(`${this.apiUrl}all`);
  }

  
  
}
