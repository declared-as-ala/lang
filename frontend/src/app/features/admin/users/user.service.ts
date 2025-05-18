import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string | null;
  score: number;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

@Injectable({ providedIn: "root" })
export class UserService {
  private base = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.base);
  }

  create(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.base, user);
  }

  update(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.base}/${id}`, user);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
