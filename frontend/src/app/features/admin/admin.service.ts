import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

export interface AdminUserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  score: number;
  level: string;
}

export interface AdminFlashcardDTO {
  mongoId: string;
  id: number;
  english: string;
  german: string;
  article: string;
  exampleSentence: string;
  level: string;
  score: number;
}

export interface AdminConjugationDTO {
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

export interface AdminSynonymDTO {
  id: string;
  cardId: number;
  wordEnglish: string;
  wordGerman: string;
  synonymEnglish: string;
  synonymGerman: string;
  antonymEnglish: string;
  antonymGerman: string;
  level: string;
  score: number;
}

export interface AdminFillBlankDTO {
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
export class AdminService {
  deleteUser(id: string) {
    throw new Error("Method not implemented.");
  }
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Users
  getUsers(): Observable<AdminUserDTO[]> {
    return this.http.get<AdminUserDTO[]>(`${this.apiUrl}/users`);
  }

  // Flashcards
  getFlashcards(): Observable<AdminFlashcardDTO[]> {
    return this.http.get<AdminFlashcardDTO[]>(`${this.apiUrl}/flashcard`);
  }

  // Conjugations
  getConjugations(): Observable<AdminConjugationDTO[]> {
    return this.http.get<AdminConjugationDTO[]>(`${this.apiUrl}/conjugation`);
  }

  // Synonyms/Antonyms
  getSynonyms(): Observable<AdminSynonymDTO[]> {
    return this.http.get<AdminSynonymDTO[]>(`${this.apiUrl}/synant`);
  }

  // Fill in the Blanks
  getFillBlanks(): Observable<AdminFillBlankDTO[]> {
    return this.http.get<AdminFillBlankDTO[]>(`${this.apiUrl}/fillblank`);
  }
}
