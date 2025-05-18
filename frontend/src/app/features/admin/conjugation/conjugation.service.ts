import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

export interface Conjugation {
  id: string;
  questionId: string | null;
  verb: string;
  translation: string;
  tense: string;
  subject: string;
  questionText: string;
  correctAnswer: string;
  wrongAnswers: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  scoreValue: number;
}

@Injectable({ providedIn: "root" })
export class ConjugationService {
  private base = `${environment.apiUrl}/admin/conjugation`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Conjugation[]> {
    return this.http.get<Conjugation[]>(this.base);
  }
  create(item: Partial<Conjugation>): Observable<Conjugation> {
    return this.http.post<Conjugation>(this.base, item);
  }
  update(id: string, item: Partial<Conjugation>): Observable<Conjugation> {
    return this.http.put<Conjugation>(`${this.base}/${id}`, item);
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
