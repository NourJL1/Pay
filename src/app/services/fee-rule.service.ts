import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeeRule } from '../entities/fee-rule';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeeRuleService {

private apiUrl = `${environment.apiUrl}/fee-rule`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<FeeRule[]> {
    return this.http.get<FeeRule[]>(this.apiUrl);
  }

  getById(id: number): Observable<FeeRule> {
    return this.http.get<FeeRule>(`${this.apiUrl}/${id}`);
  }

  create(feeRule: FeeRule): Observable<FeeRule> {
    return this.http.post<FeeRule>(this.apiUrl, feeRule, this.httpOptions);
  }

  update(id: number, feeRule: FeeRule): Observable<FeeRule> {
    return this.http.put<FeeRule>(`${this.apiUrl}/${id}`, feeRule, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<FeeRule[]> {
    return this.http.get<FeeRule[]>(`${this.apiUrl}/search?word=${word}`);
  }}
