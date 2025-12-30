import { Injectable,inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat, RtaGetMsgCon,RtaPost,RtaGetAllChats } from '../models/chat';
import { getApiUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {
  private platformId = inject(PLATFORM_ID);
  private API_URL = getApiUrl(this.platformId);
  private apiUrl= `${this.API_URL}/api/chats/`;
  private http =inject(HttpClient)
  //constructor(private http: HttpClient) {}


getChatsByMsgContacto(termino: string): Observable<Chat[]> {
  return this.http.get<Chat[]>(`${this.apiUrl}byMsgContacto`, {
    params: { termino }   
  });
}

getMsgCon(user2Id: number): Observable<RtaGetMsgCon> {
  return this.http.get<RtaGetMsgCon>(`${this.apiUrl}MsgCon`, {
    params: { user2Id: user2Id.toString() }
  });
}

getAllChats(): Observable<RtaGetAllChats> {
  return this.http.get<RtaGetAllChats>(`${this.apiUrl}chats`);
}

postChat(user2Id: number): Observable<RtaPost> {
  return this.http.post<RtaPost>(`${this.apiUrl}`, null, {
    params: { user2Id: user2Id.toString() }   
  });
}

}
