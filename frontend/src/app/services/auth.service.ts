import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError, map, of } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth/login`;
  
  isAuthenticated = signal<boolean>(false);
  
  private userToken: string | null = null;
  private userEmail: string | null = null;
  private userRole: string | null = null;

  constructor() {
    const authState = sessionStorage.getItem('isAuthenticated');
    const token = sessionStorage.getItem('authToken');
    const email = sessionStorage.getItem('userEmail');
    const role = sessionStorage.getItem('userRole');
    
    if (authState === 'true' && token) {
      this.isAuthenticated.set(true);
      this.userToken = token;
      this.userEmail = email;
      this.userRole = role;
    }
  }

  login(email: string, password: string): Observable<{ success: boolean; message: string }> {
    const loginRequest: LoginRequest = { email, password };
    
    return this.http.post<LoginResponse>(this.apiUrl, loginRequest).pipe(
      map(response => {
        if (response.success) {
          this.isAuthenticated.set(true);
          this.userToken = response.token;
          this.userEmail = response.email;
          this.userRole = response.role;
          
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('authToken', response.token);
          sessionStorage.setItem('userEmail', response.email);
          sessionStorage.setItem('userRole', response.role);
          
          return { success: true, message: response.message };
        }
        return { success: false, message: response.message };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        const message = error.error?.message || 'Login failed. Please try again.';
        return of({ success: false, message });
      })
    );
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.userToken = null;
    this.userEmail = null;
    this.userRole = null;
    
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userRole');
  }

  getToken(): string | null {
    return this.userToken;
  }

  getUserEmail(): string | null {
    return this.userEmail;
  }

  getUserRole(): string | null {
    return this.userRole;
  }

  isAdmin(): boolean {
    return this.userRole === 'Admin';
  }
}
