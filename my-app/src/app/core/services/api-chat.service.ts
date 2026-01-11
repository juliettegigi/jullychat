import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'
import { Chat, RtaGetMsgCon,RtaPost,RtaGetAllChats, RtaPatchClavaVisto } from '../models/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {
  //private API_URL = getApiUrl(this.platformId);
  //private apiUrl= `${this.API_URL}/api/chats/`;
 
  private http =inject(HttpClient)
  private apiUrl=`${environment.apiUrl}/api/chats/`;
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

patchClavaVisto(chatId: number,userId:number): Observable<RtaPatchClavaVisto> {
  return this.http.patch<RtaPatchClavaVisto>(
    `${this.apiUrl}clavaVisto/${chatId}/${userId}`,
    null // no mandás body
  );
}



postChat(user2Id: number): Observable<RtaPost> {
  return this.http.post<RtaPost>(`${this.apiUrl}`, null, {
    params: { user2Id: user2Id.toString() }   
  });
}



}
