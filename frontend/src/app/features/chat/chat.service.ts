import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ChatRequest, ChatResponse } from "./chat.model";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  constructor(private http: HttpClient) {}

  sendMessage(
    messages: { role: string; content: string }[]
  ): Observable<ChatResponse> {
    const url = `${environment.apiUrl}/chat`;
    const body: ChatRequest = { messages };
    return this.http.post<ChatResponse>(url, body);
  }
}
