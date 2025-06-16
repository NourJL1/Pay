import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WalletCategoryOperationTypeMap } from '../entities/wallet-category-operation-type-map';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletCategoryOperationTypeMapService {

private apiUrl = `${environment.apiUrl}/wallet-category-operation-type-map`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<WalletCategoryOperationTypeMap[]> {
    return this.http.get<WalletCategoryOperationTypeMap[]>(this.apiUrl);
  }

  getById(id: number): Observable<WalletCategoryOperationTypeMap> {
    return this.http.get<WalletCategoryOperationTypeMap>(`${this.apiUrl}/${id}`);
  }

  create(mapping: WalletCategoryOperationTypeMap): Observable<WalletCategoryOperationTypeMap> {
    return this.http.post<WalletCategoryOperationTypeMap>(this.apiUrl, mapping, this.httpOptions);
  }

  update(id: number, mapping: WalletCategoryOperationTypeMap): Observable<WalletCategoryOperationTypeMap> {
    return this.http.put<WalletCategoryOperationTypeMap>(`${this.apiUrl}/${id}`, mapping, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<WalletCategoryOperationTypeMap[]> {
    return this.http.get<WalletCategoryOperationTypeMap[]>(`${this.apiUrl}/search?word=${word}`);
  }}
