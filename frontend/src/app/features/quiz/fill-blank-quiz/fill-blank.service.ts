import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

export interface FillBlankQuestion {
  id: string;
  sentence: string;
  translation: string;
  questionText: string;
  correctAnswer: string;
  wrongAnswers: string[];
  level: string;
  score: number;
}

@Injectable({
  providedIn: "root",
})
export class FillBlankService {
  private readonly apiUrl = `${environment.apiUrl}/fillblank`;

  constructor(private http: HttpClient) {}

  getQuestions(
    level: string,
    num: number = 10
  ): Observable<FillBlankQuestion[]> {
    const apiLevel = this.mapLevelToApi(level);
    return this.http.get<FillBlankQuestion[]>(
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
