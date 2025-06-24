import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WalletCategory } from '../entities/wallet-category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletCategoryService {
<<<<<<< HEAD
  private apiUrl = `${environment.apiUrl}/api/wallet-categories`;
=======

private apiUrl = `${environment.apiUrl}/api/wallet-categories`;
>>>>>>> c8eb148005385c8f29130972be4aa41fc72c4ff0

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // 'X-Roles': 'ROLE_ADMIN' // Uncomment for testing
    })
  };

  private deleteOptions = {
    headers: new HttpHeaders({
      // No Content-Type for DELETE as it has no body
      // 'X-Roles': 'ROLE_ADMIN' // Uncomment for testing
    })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<WalletCategory[]> {
    return this.http.get<WalletCategory[]>(this.apiUrl, this.httpOptions);
  }

  getById(id: number): Observable<WalletCategory> {
    return this.http.get<WalletCategory>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  create(walletCategory: WalletCategory): Observable<WalletCategory> {
    return this.http.post<WalletCategory>(this.apiUrl, walletCategory, this.httpOptions);
  }

  update(id: number, walletCategory: WalletCategory): Observable<WalletCategory> {
    return this.http.put<WalletCategory>(`${this.apiUrl}/${id}`, walletCategory, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.deleteOptions);
  }

  search(word: string): Observable<WalletCategory[]> {
    return this.http.get<WalletCategory[]>(`${this.apiUrl}/search?word=${word}`, this.httpOptions);
  }
}