import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

export interface SynAnt {
  id: string;
  cardId: number;
  wordEnglish: string;
  wordGerman: string;
  synonymEnglish: string;
  synonymGerman: string;
  antonymEnglish: string;
  antonymGerman: string;
  level: "easy" | "medium" | "hard";
  score: number;
}

@Injectable({ providedIn: "root" })
export class SynAntService {
  private base = `${environment.apiUrl}/admin/synant`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SynAnt[]> {
    return this.http.get<SynAnt[]>(this.base);
  }
  create(item: Partial<SynAnt>): Observable<SynAnt> {
    return this.http.post<SynAnt>(this.base, item);
  }
  update(id: string, item: Partial<SynAnt>): Observable<SynAnt> {
    return this.http.put<SynAnt>(`${this.base}/${id}`, item);
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
