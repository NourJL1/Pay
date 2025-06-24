import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WalletStatus } from '../entities/wallet-status';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletStatusService {

 private apiUrl = `${environment.apiUrl}/api/wallet-status`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<WalletStatus[]> {
    return this.http.get<WalletStatus[]>(this.apiUrl);
  }

  getById(id: number): Observable<WalletStatus> {
    return this.http.get<WalletStatus>(`${this.apiUrl}/${id}`);
  }

  create(walletStatus: WalletStatus): Observable<WalletStatus> {
    return this.http.post<WalletStatus>(this.apiUrl, walletStatus, this.httpOptions);
  }

  update(id: number, walletStatus: WalletStatus): Observable<WalletStatus> {
    return this.http.put<WalletStatus>(`${this.apiUrl}/${id}`, walletStatus, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<WalletStatus[]> {
    return this.http.get<WalletStatus[]>(`${this.apiUrl}/search?word=${word}`);
  }}
