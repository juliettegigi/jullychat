import { Injectable,inject,PLATFORM_ID  } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { getApiUrl } from '../config/api.config';
@Injectable({ providedIn: 'root' })
export class SocketService {   // <-- tiene que tener "export"
  private socket: Socket | null = null;
  private platformId = inject(PLATFORM_ID);
  private API_URL = getApiUrl(this.platformId);

  connect() {
    if (!this.socket) {
      
          const token = localStorage.getItem('token'); // 🔥 obtenemos el token del login
      
          this.socket = io(this.API_URL, {
            transports: ['websocket'],
            auth: {
              token: token  // 🔥 enviamos el token al backend
            }
          });
        }
  }

  emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }

  listen<T>(event: string): Observable<T> {
    return new Observable((subscriber) => {
      this.socket?.on(event, (data: T) => {
        subscriber.next(data);
      });
    });
  }

  on<T = any>(event: string, callback: (data: T) => void) {
    this.socket?.on(event, callback);
  }
}