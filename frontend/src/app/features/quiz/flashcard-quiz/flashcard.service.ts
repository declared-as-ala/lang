import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

export interface FlashCard {
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
  private apiUrl = `${environment.apiUrl}/flashcard`;

  constructor(private http: HttpClient) {}

  getFlashcards(level: string): Observable<FlashCard[]> {
    const apiLevel = this.mapLevelToApi(level);
    const numCards = this.getNumCardsByLevel(level);
    return this.http.get<FlashCard[]>(
      `${this.apiUrl}?level=${apiLevel}&num=${numCards}`
    );
  }

  private mapLevelToApi(level: string): string {
    switch (level.toUpperCase()) {
      case "BEGINNER":
        return "easy";
      case "INTERMEDIATE":
        return "medium";
      case "ADVANCED":
        return "hard";
      default:
        return "easy";
    }
  }

  private getNumCardsByLevel(level: string): number {
    switch (level.toLowerCase()) {
      case "beginner":
        return 10;
      case "intermediate":
        return 20;
      case "advanced":
        return 30;
      default:
        return 10;
    }
  }
}
