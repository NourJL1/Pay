import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WalletOperationTypeMap } from '../entities/wallet-operation-type-map';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletOperationTypeMapService {

private apiUrl = `${environment.apiUrl}/wallet-operation-type-map`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<WalletOperationTypeMap[]> {
    return this.http.get<WalletOperationTypeMap[]>(this.apiUrl);
  }

  getById(id: number): Observable<WalletOperationTypeMap> {
    return this.http.get<WalletOperationTypeMap>(`${this.apiUrl}/${id}`);
  }

  create(mapping: WalletOperationTypeMap): Observable<WalletOperationTypeMap> {
    return this.http.post<WalletOperationTypeMap>(this.apiUrl, mapping, this.httpOptions);
  }

  update(id: number, mapping: WalletOperationTypeMap): Observable<WalletOperationTypeMap> {
    return this.http.put<WalletOperationTypeMap>(`${this.apiUrl}/${id}`, mapping, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<WalletOperationTypeMap[]> {
    return this.http.get<WalletOperationTypeMap[]>(`${this.apiUrl}/search?word=${word}`);
  }}
