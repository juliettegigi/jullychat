import { Injectable,inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { rtaLogin, User } from '../models/user';
import { getApiUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
   private platformId = inject(PLATFORM_ID);
   private API_URL = getApiUrl(this.platformId);
  private apiUrlSesion = `${this.API_URL}/api/sesion/`;
  private apiUrlUsuario = `${this.API_URL}/api/users/`;
  private http =inject(HttpClient)
  //constructor(private http: HttpClient) {}


  // Iniciar sesión
  login(email: string, pass: string): Observable<rtaLogin> {  // este observable me emite la rta del backend
    return this.http.post<rtaLogin>(`${this.apiUrlSesion}login`, { email, pass});
  }

  // -------------------------------
  // Nuevo método: login con Google
  // -------------------------------
    loginWithGoogle(id_token: string): Observable<rtaLogin> {
    // El backend debe recibir { id_token } en el body
    return this.http.post<rtaLogin>(`${this.apiUrlSesion}loginGoogle`, { id_token });
  }

  
  // Obtener todos los usuarios
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrlUsuario);
  }

  // Obtener un usuario por ID
  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrlUsuario}${id}`);
  }
  // Obtener un usuario por userName e email
  getByUserNameAndEmail(termino: string): Observable<User[]> {
     const encoded = encodeURIComponent(termino);
  return this.http.get<User[]>(`${this.apiUrlUsuario}${encoded}`);
    //return this.http.get<User[]>(`${this.apiUrlUsuario}${termino}`);
  }

  // Crear un nuevo usuario
  create(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrlUsuario, user);
  }

  // Actualizar un usuario
  update(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrlUsuario}${id}`, user);
  }

  // Eliminar un usuario
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrlUsuario}${id}`);
  }
}
