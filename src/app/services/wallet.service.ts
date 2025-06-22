import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { interval, switchMap, distinctUntilChanged } from 'rxjs';
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
getWalletCount(): Observable<number> {
  const headers = this.getHeaders(); // récupère token et autres headers définis
  return this.http.get<number>(`${this.apiUrl}/count`, { headers });
}




getWalletStatus(): Observable<WalletStatus> {
  const cusCode = localStorage.getItem('cusCode');
  if (!cusCode) {
    return throwError(() => new Error('No customer code found in localStorage'));
  }

  const headers = this.getHeaders();

  return this.http.get<any>(`${this.apiUrl}/by-customer/${cusCode}/status`, { headers }).pipe(
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

interface WALLET {
  walCode: number;
  walletStatus: WalletStatus;
}