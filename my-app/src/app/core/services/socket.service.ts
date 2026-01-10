import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {

  private socket: Socket | null = null;
  private platformId = inject(PLATFORM_ID);

  /**
   * Conecta el socket al backend.
   * - Usa el mismo origin (proxy / producción / ngrok)
   * - Evita conexiones duplicadas
   */
  connect(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.socket?.connected) return;

    const token = localStorage.getItem('token');

    this.socket = io({
      transports: ['websocket'],
      auth: { token }
    });
  }

  /**
   * Emite un evento al servidor
   */
  emit(event: string, data?: any): void {
    this.socket?.emit(event, data);
  }

  /**
   * Escucha un evento y lo expone como Observable
   * - Evita listeners duplicados
   * - Limpia automáticamente al desuscribirse
   */
  listen<T>(event: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      if (!this.socket) return;

      const handler = (data: T) => {
        subscriber.next(data);
      };

      // Evitar duplicados
      this.socket.off(event, handler);
      this.socket.on(event, handler);

      // Cleanup al desuscribirse
      return () => {
        this.socket?.off(event, handler);
      };
    });
  }

  /**
   * Listener directo (cuando no necesitás Observable)
   */
  on<T = any>(event: string, callback: (data: T) => void): void {
    this.socket?.on(event, callback);
  }

  /**
   * Desconecta el socket completamente
   */
  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}
