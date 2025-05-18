import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

export interface SynonymQuestion {
  id: string;
  wordEnglish: string;
  wordGerman: string;
  synonymEnglish: string;
  synonymGerman: string;
  antonymEnglish: string;
  antonymGerman: string;
  level: string;
  scoreValue: number;
}

@Injectable({
  providedIn: "root",
})
export class SynonymQuizService {
  private readonly apiUrl = `${environment.apiUrl}/synant`;

  constructor(private http: HttpClient) {}

  getRandomQuestions(
    level: string,
    num: number
  ): Observable<SynonymQuestion[]> {
    const apiLevel = this.mapLevelToApi(level);
    return this.http.get<SynonymQuestion[]>(
      `${this.apiUrl}?level=${apiLevel}&num=${num}`
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
}
