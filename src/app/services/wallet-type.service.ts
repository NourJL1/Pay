import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WalletType } from '../entities/wallet-type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletTypeService {

private apiUrl = `${environment.apiUrl}/wallet-types`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<WalletType[]> {
    return this.http.get<WalletType[]>(this.apiUrl);
  }

  getById(id: number): Observable<WalletType> {
    return this.http.get<WalletType>(`${this.apiUrl}/${id}`);
  }

  create(walletType: WalletType): Observable<WalletType> {
    return this.http.post<WalletType>(this.apiUrl, walletType, this.httpOptions);
  }

  update(id: number, walletType: WalletType): Observable<WalletType> {
    return this.http.put<WalletType>(`${this.apiUrl}/${id}`, walletType, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<WalletType[]> {
    return this.http.get<WalletType[]>(`${this.apiUrl}/search?word=${word}`);
  }}
