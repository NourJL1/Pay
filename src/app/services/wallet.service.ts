import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { interval, switchMap, distinctUntilChanged } from 'rxjs';
import { WalletStatus } from '../entities/wallet-status';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = `${environment.apiUrl}/wallets`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const roles = this.authService.getRoles();
    return new HttpHeaders({
      'X-Roles': roles || '',
      'Content-Type': 'application/json'
    });
  }

  getWalletStatus(): Observable<WalletStatus> {
    const cusCode = Number(localStorage.getItem('cusCode'));
    if (!cusCode) {
      throw new Error('No customer code found in localStorage');
    }
    return this.http.get<WALLET[]>(`${this.apiUrl}/by-customer/${cusCode}`, { headers: this.getHeaders() }).pipe(
      tap((response) => {
        console.log('Wallet response:', response);
        if (!response.length || !response[0].walletStatus?.wstIden || !['PENDING', 'ACTIVE', 'REJECTED'].includes(response[0].walletStatus.wstIden)) {
          console.warn('Invalid wallet status received:', response[0]?.walletStatus?.wstIden);
        }
      }),
      map((response) => {
        return response.length > 0 && response[0].walletStatus
          ? response[0].walletStatus
          : { wstIden: 'PENDING' } as WalletStatus;
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