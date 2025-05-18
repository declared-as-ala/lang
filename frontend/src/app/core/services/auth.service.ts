import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError, of } from "rxjs";
import { catchError, tap, finalize } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { User, AuthResponse } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly userKey = "current_user";
  private readonly tokenKey = "auth_token";
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  user$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  authLoading = signal(false);
  authError = signal<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const userJson = localStorage.getItem(this.userKey);

    if (userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout(); // En cas d'erreur JSON, forcer logout
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    this.authLoading.set(true);
    this.authError.set(null);

    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          if (response.success) {
            localStorage.setItem(this.userKey, JSON.stringify(response.user));
            localStorage.setItem(this.tokenKey, response.cookie.value);
            this.currentUserSubject.next(response.user);
            this.isAuthenticatedSubject.next(true);

            if (response.user.roles.includes("ADMIN")) {
              this.router.navigate(["/admin"]);
            } else {
              this.router.navigate(["/dashboard"]);
            }
          }
        }),
        catchError((error) => {
          this.authError.set(error.error?.message || "Login failed");
          return throwError(() => error);
        }),
        finalize(() => this.authLoading.set(false))
      );
  }

  register(userData: any): Observable<AuthResponse> {
    this.authLoading.set(true);
    this.authError.set(null);

    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData)
      .pipe(
        tap((response) => {
          if (response.success) {
            localStorage.setItem(this.userKey, JSON.stringify(response.user));
            localStorage.setItem(this.tokenKey, response.cookie.value);
            this.currentUserSubject.next(response.user);
            this.isAuthenticatedSubject.next(true);
            this.router.navigate(["/dashboard"]);
          }
        }),
        catchError((error) => {
          this.authError.set(error.error?.message || "Registration failed");
          return throwError(() => error);
        }),
        finalize(() => this.authLoading.set(false))
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/forgot-password`, {
      email,
    });
  }

  logout(): void {
    this.http
      .post(`${environment.apiUrl}/auth/logout`, {})
      .pipe(
        catchError((error) => {
          console.warn("Logout failed, clearing local storage anyway", error);
          return of(null); // ignore error but continue
        }),
        finalize(() => {
          localStorage.removeItem(this.userKey);
          localStorage.removeItem(this.tokenKey);
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          this.router.navigate(["/auth/login"]);
        })
      )
      .subscribe(); // required to trigger request
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.roles.includes("ADMIN") || false;
  }
}
