import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'backroom_token';
  private readonly USER_KEY = 'backroom_user';
  private readonly SA_TOKEN_KEY = 'backroom_sa_token';
  private readonly SA_USER_KEY = 'backroom_sa_user';

  currentUser = signal<User | null>(this.loadStoredUser());
  isImpersonating = signal<boolean>(!!localStorage.getItem(this.SA_TOKEN_KEY));

  isSuperadmin = computed(() => this.currentUser()?.role === 'superadmin');

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res) => this.storeSession(res)),
    );
  }

  register(payload: { email: string; password: string; firstName: string; lastName: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload).pipe(
      tap((res) => this.storeSession(res)),
    );
  }

  impersonateClub(clubId: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/superadmin/impersonate`, { clubId }).pipe(
      tap((res) => {
        localStorage.setItem(this.SA_TOKEN_KEY, localStorage.getItem(this.TOKEN_KEY) ?? '');
        localStorage.setItem(this.SA_USER_KEY, localStorage.getItem(this.USER_KEY) ?? '');
        this.storeSession(res);
        this.isImpersonating.set(true);
      }),
    );
  }

  exitImpersonation() {
    const saToken = localStorage.getItem(this.SA_TOKEN_KEY);
    const saUser = localStorage.getItem(this.SA_USER_KEY);
    if (saToken && saUser) {
      localStorage.setItem(this.TOKEN_KEY, saToken);
      localStorage.setItem(this.USER_KEY, saUser);
      this.currentUser.set(JSON.parse(saUser));
    }
    localStorage.removeItem(this.SA_TOKEN_KEY);
    localStorage.removeItem(this.SA_USER_KEY);
    this.isImpersonating.set(false);
    this.router.navigate(['/superadmin/dashboard']);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.SA_TOKEN_KEY);
    localStorage.removeItem(this.SA_USER_KEY);
    this.currentUser.set(null);
    this.isImpersonating.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  get role() {
    return this.currentUser()?.role ?? null;
  }

  private storeSession(res: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, res.accessToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private loadStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
