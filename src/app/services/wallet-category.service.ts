import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WalletCategory } from '../entities/wallet-category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletCategoryService {

private apiUrl = `${environment.apiUrl}/api/wallet-categories`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<WalletCategory[]> {
    return this.http.get<WalletCategory[]>(this.apiUrl);
  }

  getById(id: number): Observable<WalletCategory> {
    return this.http.get<WalletCategory>(`${this.apiUrl}/${id}`);
  }

  create(walletCategory: WalletCategory): Observable<WalletCategory> {
    return this.http.post<WalletCategory>(this.apiUrl, walletCategory, this.httpOptions);
  }

  update(id: number, walletCategory: WalletCategory): Observable<WalletCategory> {
    return this.http.put<WalletCategory>(`${this.apiUrl}/${id}`, walletCategory, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<WalletCategory[]> {
    return this.http.get<WalletCategory[]>(`${this.apiUrl}/search?word=${word}`);
  }}
