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
  if (this.socket?.connected) return;

  const token = localStorage.getItem('token');

  this.socket = io(this.API_URL, {
    transports: ['websocket'],
    auth: { token }
  });
}

  emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }

  listen<T>(event: string): Observable<T> {
  return new Observable<T>((subscriber) => {
    if (!this.socket) return;

    const handler = (data: T) => {
      subscriber.next(data);
    };

    // 🚀 aseguramos que no haya duplicados
    this.socket.off(event, handler);
    this.socket.on(event, handler);

    // 🧹 limpieza cuando Angular se desuscribe
    return () => {
      this.socket?.off(event, handler);
    };
  });
}

disconnect() {
  this.socket?.disconnect();
  this.socket = null;
}

  on<T = any>(event: string, callback: (data: T) => void) {
    this.socket?.on(event, callback);
  }


}