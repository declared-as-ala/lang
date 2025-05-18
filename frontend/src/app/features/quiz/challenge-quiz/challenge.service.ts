import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

export interface ChallengeQuestion {
  id: string;
  level: string;
  questionEn: string;
  questionDe: string;
}

@Injectable({
  providedIn: "root",
})
export class ChallengeQuizService {
  private readonly apiUrl = `${environment.apiUrl}/challenge`;

  constructor(private http: HttpClient) {}

  getRandomQuestions(
    level: string,
    num: number
  ): Observable<ChallengeQuestion[]> {
    return this.http.get<ChallengeQuestion[]>(
      `${this.apiUrl}?level=${level.toUpperCase()}&num=${num}`
    );
  }
}
