import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ScoreState {
  currentScore: number;
  totalQuizzes: number;
  correctAnswers: number;
  incorrectAnswers: number;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ScoreStore {
  private readonly apiUrl = `${environment.apiUrl}/user/profile`;
  
  // State management
  private state = signal<ScoreState>({
    currentScore: 0,
    totalQuizzes: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    lastUpdated: new Date()
  });

  // Expose read-only state
  public readonly score$ = new BehaviorSubject<number>(0);
  public readonly state$ = new BehaviorSubject<ScoreState>(this.state());

  constructor(private http: HttpClient) {
    this.loadInitialScore();
  }

  // Getters
  get score(): number {
    return this.state().currentScore;
  }

  get totalQuizzes(): number {
    return this.state().totalQuizzes;
  }

  get accuracy(): number {
    const total = this.state().correctAnswers + this.state().incorrectAnswers;
    return total > 0 ? (this.state().correctAnswers / total) * 100 : 0;
  }

  // Load initial score from backend
  private loadInitialScore(): void {
    this.http.get<any>(this.apiUrl).pipe(
      tap(profile => {
        const newState: ScoreState = {
          currentScore: profile.score || 0,
          totalQuizzes: profile.totalQuizzes || 0,
          correctAnswers: profile.correctAnswers || 0,
          incorrectAnswers: profile.incorrectAnswers || 0,
          lastUpdated: new Date()
        };
        this.updateState(newState);
      }),
      catchError(error => {
        console.error('Error loading score:', error);
        throw error;
      })
    ).subscribe();
  }

  // Update score with new quiz results and scoreValue
  updateScore(scoreValue: number, correct: number = 0, incorrect: number = 0): Observable<any> {
    const currentState = this.state();
    const newState: ScoreState = {
      currentScore: currentState.currentScore + scoreValue,
      totalQuizzes: currentState.totalQuizzes + 1,
      correctAnswers: currentState.correctAnswers + correct,
      incorrectAnswers: currentState.incorrectAnswers + incorrect,
      lastUpdated: new Date()
    };

    return this.http.put(this.apiUrl, {
      score: newState.currentScore,
      totalQuizzes: newState.totalQuizzes,
      correctAnswers: newState.correctAnswers,
      incorrectAnswers: newState.incorrectAnswers
    }).pipe(
      tap(() => this.updateState(newState)),
      catchError(error => {
        console.error('Error updating score:', error);
        throw error;
      })
    );
  }

  // Reset score
  resetScore(): Observable<any> {
    const initialState: ScoreState = {
      currentScore: 0,
      totalQuizzes: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      lastUpdated: new Date()
    };

    return this.http.put(this.apiUrl, {
      score: 0,
      totalQuizzes: 0,
      correctAnswers: 0,
      incorrectAnswers: 0
    }).pipe(
      tap(() => this.updateState(initialState)),
      catchError(error => {
        console.error('Error resetting score:', error);
        throw error;
      })
    );
  }

  // Private helper to update state
  private updateState(newState: ScoreState): void {
    this.state.set(newState);
    this.score$.next(newState.currentScore);
    this.state$.next(newState);
  }
}