import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fees } from '../entities/fees';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeesService {

 private apiUrl = `${environment.apiUrl}/fees`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<Fees[]> {
    return this.http.get<Fees[]>(this.apiUrl);
  }

  getById(id: number): Observable<Fees> {
    return this.http.get<Fees>(`${this.apiUrl}/${id}`);
  }

  create(fees: Fees): Observable<Fees> {
    return this.http.post<Fees>(this.apiUrl, fees, this.httpOptions);
  }

  update(id: number, fees: Fees): Observable<Fees> {
    return this.http.put<Fees>(`${this.apiUrl}/${id}`, fees, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<Fees[]> {
    return this.http.get<Fees[]>(`${this.apiUrl}/search?word=${word}`);
  }}
