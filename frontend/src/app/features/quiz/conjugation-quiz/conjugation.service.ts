import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

export interface ConjugationQuestion {
  id: string;
  questionId: string | null;
  verb: string;
  translation: string;
  tense: string;
  subject: string;
  questionText: string;
  correctAnswer: string;
  wrongAnswers: string[];
  difficulty: string;
  scoreValue: number;
}

@Injectable({
  providedIn: "root",
})
export class ConjugationService {
  private readonly apiUrl = `${environment.apiUrl}/conjugation`;

  constructor(private http: HttpClient) {}

  getQuestions(
    level: string,
    num: number = 10
  ): Observable<ConjugationQuestion[]> {
    const apiLevel = this.mapLevelToApi(level);
    return this.http.get<ConjugationQuestion[]>(
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
