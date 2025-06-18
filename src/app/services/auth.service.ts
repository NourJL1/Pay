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

  register(customer: Customer, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('customer', JSON.stringify(customer));
    if (files?.length) {
      files.forEach(file => formData.append('files', file, file.name));
    }
    return this.http.post(`${this.apiUrl}/api/customers/register`, formData).pipe(
      tap(response => console.log('Customer registration successful:', response)),
      catchError(this.handleError)
    );
  }

  login(username: string, password: string): Observable<any> {
    const loginPayload = { username, password };
    return this.http.post<any>(`${this.apiUrl}/api/customers/login`, loginPayload).pipe(
      tap({
        next: (response) => {
          console.log('Login response:', response);
          localStorage.setItem('roles', response.roles); // Changed from authToken
          localStorage.setItem('role', JSON.stringify(response.role));
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