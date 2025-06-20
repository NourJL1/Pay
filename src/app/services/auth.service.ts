import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Customer } from '../entities/customer';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<any> {
    const loginPayload = { username, password };
    return this.http.post<any>(`${this.apiUrl}/api/customers/login`, loginPayload).pipe(
      tap({
        next: (response) => {
          console.log('Login response:', response);
          localStorage.setItem('roles', response.roles || 'ROLE_CUSTOMER'); // Fallback to ROLE_CUSTOMER
          // Extract role name from response.role (e.g., { name: "CUSTOMER" })
          const roleName = response.role?.name || response.role || 'CUSTOMER';
          localStorage.setItem('role', roleName); // Store role name (e.g., "CUSTOMER")
          localStorage.setItem('username', response.username);
          localStorage.setItem('cusCode', response.cusCode);
          localStorage.setItem('fullname', response.fullname || '');
          this.userService.setLoggedInUserId(Number(response.cusCode));
        },
        error: (err) => { console.error('Customer login failed:', err); }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.userService.clearLoggedInUserId();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('roles') && !!localStorage.getItem('cusCode');
  }

  getRoles(): string | null {
    return localStorage.getItem('roles');
  }

  private handleError(error: HttpErrorResponse) {
    const errorMessage = error.error?.message || error.message || 'An unknown error occurred!';
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}