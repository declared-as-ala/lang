import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";

export interface TranslateRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
}

export interface TranslateResponse {
  english: string;
  german: string;
  pronunciation: string;
  imageUrl: string;
  exampleEnglish: string;
  exampleGerman: string;
  status: string;
  tags: string[];
}

export interface ParagraphTranslateResponse {
  original: string;
  translated: string;
}

@Injectable({
  providedIn: "root",
})
export class TranslateService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  translateWord(
    word: string,
    fromLanguage: string,
    toLanguage: string
  ): Observable<TranslateResponse> {
    const url = `${this.apiUrl}/translate`;
    const body: TranslateRequest = {
      text: word,
      fromLanguage,
      toLanguage,
    };

    return this.http
      .post<TranslateResponse>(url, body, { headers: this.createHeaders() })
      .pipe(catchError(this.handleError));
  }

  translateText(
    text: string,
    fromLanguage: string,
    toLanguage: string
  ): Observable<ParagraphTranslateResponse> {
    const url = `${this.apiUrl}/translate/paragraph`;
    const body: TranslateRequest = {
      text,
      fromLanguage,
      toLanguage,
    };

    return this.http
      .post<ParagraphTranslateResponse>(url, body, {
        headers: this.createHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error("An error occurred:", error);
    return throwError(() => new Error("Translation failed. Please try again."));
  }
}
