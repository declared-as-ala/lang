import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

export interface FillBlank {
  id: string;
  sentence: string;
  translation: string;
  questionText: string;
  correctAnswer: string;
  wrongAnswers: string[];
  level: "Easy" | "Medium" | "Hard";
  score: number;
}

@Injectable({ providedIn: "root" })
export class FillBlankService {
  private base = `${environment.apiUrl}/admin/fillblank`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<FillBlank[]> {
    return this.http.get<FillBlank[]>(this.base);
  }
  create(item: Partial<FillBlank>): Observable<FillBlank> {
    return this.http.post<FillBlank>(this.base, item);
  }
  update(id: string, item: Partial<FillBlank>): Observable<FillBlank> {
    return this.http.put<FillBlank>(`${this.base}/${id}`, item);
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
