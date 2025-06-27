import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { interval, switchMap, distinctUntilChanged } from 'rxjs';
import { Wallet } from '../entities/wallet';
import { WalletStatus } from '../entities/wallet-status';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = `${environment.apiUrl}/api/wallets`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role') || 'CUSTOMER';
    const rolesHeader = `ROLE_${role.toUpperCase()}`;

    let headers = new HttpHeaders({
      'X-Roles': rolesHeader,
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getAll(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map(wallets => wallets.map(wallet => new Wallet({
        walCode: wallet.walCode,
        walIden: wallet.walIden,
        walLabe: wallet.walLabe
      }))),
      catchError(error => {
        console.error('Error fetching wallets:', error);
        return throwError(() => new Error('Failed to fetch wallets'));
      })
    );
  }

  getWalletCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching wallet count:', error);
        return throwError(() => new Error('Failed to fetch wallet count'));
      })
    );
  }

  getWalletStatus(): Observable<WalletStatus> {
    const cusCode = localStorage.getItem('cusCode');
    if (!cusCode) {
      return throwError(() => new Error('No customer code found in localStorage'));
    }

    return this.http.get<any>(`${this.apiUrl}/by-customer/${cusCode}/status`, { headers: this.getHeaders() }).pipe(
      map(response => {
        if (!response) throw new Error('No wallet status found');
        return new WalletStatus({
          wstCode: response.wstCode,
          wstIden: response.wstIden,
          wstLabe: response.wstLabe,
        });
      }),
      catchError(error => {
        console.error('Error fetching wallet status:', error);
        return throwError(() => new Error('Wallet status not found or server error'));
      })
    );
  }

  startStatusPolling(intervalMs: number = 30000): Observable<WalletStatus> {
    return interval(intervalMs).pipe(
      switchMap(() => this.getWalletStatus()),
      distinctUntilChanged((prev, curr) => prev.wstIden === curr.wstIden)
    );
  }
}