export interface Mensaje {
    emisorId: number;
    chatId: number;
    isRead: boolean;
    contenido: string;
    createdAt: Date;
  }
