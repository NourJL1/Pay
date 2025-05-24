import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { interval } from 'rxjs';

type walletStatus = 'PENDING' | 'ACTIVE' | 'REJECTED';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  constructor(private http: HttpClient) {}

  getWalletStatus(): Observable<walletStatus> {
    return this.http.get('http://localhost:8081//api/wallet-status/{id}')
    .pipe(
      tap((response: any) => {
        if (!['PENDING', 'ACTIVE', 'REJECTED'].includes(response.walletStatus)) {
          console.warn('Invalid wallet status received:', response.walletStatus);
        }
      }),
      map((response: any) => {
        // Ensure the status is one of the allowed values
        const walletStatus = response.walletStatus?.toUpperCase();
        return (walletStatus === 'PENDING' || walletStatus === 'ACTIVE' || walletStatus === 'REJECTED') 
          ? walletStatus 
          : 'PENDING';
      })
    );
  }

  startStatusPolling(intervalMs: number = 30000) {
    return interval(intervalMs).pipe(
      switchMap(() => this.getWalletStatus()),
      distinctUntilChanged()
    );
  }
}