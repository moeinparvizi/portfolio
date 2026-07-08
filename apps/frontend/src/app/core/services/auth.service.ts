import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = '/api/auth';

  private accessToken = signal<string | null>(localStorage.getItem('accessToken'));
  private refreshToken = signal<string | null>(localStorage.getItem('refreshToken'));

  isAuthenticated = computed(() => !!this.accessToken());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(username: string, password: string) {
    return this.http.post<AuthTokens>(`${this.API_URL}/login`, { username, password })
      .pipe(
        tap(tokens => {
          this.setTokens(tokens);
        }),
      );
  }

  refresh() {
    const refresh = this.refreshToken();
    if (!refresh) {
      this.logout();
      return;
    }

    return this.http.post<AuthTokens>(`${this.API_URL}/refresh`, { refreshToken: refresh })
      .pipe(
        tap(tokens => {
          this.setTokens(tokens);
        }),
      );
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.router.navigate(['/admin/login']);
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  private setTokens(tokens: AuthTokens) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    this.accessToken.set(tokens.accessToken);
    this.refreshToken.set(tokens.refreshToken);
  }
}
