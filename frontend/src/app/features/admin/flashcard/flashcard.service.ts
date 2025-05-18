import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

export interface FlashcardDTO {
  mongoId: string;
  id: number;
  english: string;
  german: string;
  article: string;
  exampleSentence: string;
  level: string;
  score: number;
}

@Injectable({
  providedIn: "root",
})
export class FlashcardService {
  private readonly apiUrl = `${environment.apiUrl}/admin/flashcard`;

  constructor(private http: HttpClient) {}

  getFlashcards(): Observable<FlashcardDTO[]> {
    return this.http.get<FlashcardDTO[]>(this.apiUrl);
  }

  getFlashcard(id: string): Observable<FlashcardDTO> {
    return this.http.get<FlashcardDTO>(`${this.apiUrl}/${id}`);
  }

  createFlashcard(
    flashcard: Omit<FlashcardDTO, "mongoId" | "id">
  ): Observable<FlashcardDTO> {
    return this.http.post<FlashcardDTO>(this.apiUrl, flashcard);
  }

  updateFlashcard(
    id: string,
    flashcard: Partial<FlashcardDTO>
  ): Observable<FlashcardDTO> {
    return this.http.put<FlashcardDTO>(`${this.apiUrl}/${id}`, flashcard);
  }

  deleteFlashcard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchFlashcards(query: string): Observable<FlashcardDTO[]> {
    return this.http.get<FlashcardDTO[]>(`${this.apiUrl}/search?q=${query}`);
  }

  getFlashcardsByLevel(level: string): Observable<FlashcardDTO[]> {
    return this.http.get<FlashcardDTO[]>(`${this.apiUrl}?level=${level}`);
  }
}
