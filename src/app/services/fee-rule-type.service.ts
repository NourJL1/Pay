import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeeRuleType } from '../entities/fee-rule-type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeeRuleTypeService {

private apiUrl = `${environment.apiUrl}/fee-rule-types`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<FeeRuleType[]> {
    return this.http.get<FeeRuleType[]>(this.apiUrl);
  }

  getById(id: number): Observable<FeeRuleType> {
    return this.http.get<FeeRuleType>(`${this.apiUrl}/${id}`);
  }

  create(feeRuleType: FeeRuleType): Observable<FeeRuleType> {
    return this.http.post<FeeRuleType>(this.apiUrl, feeRuleType, this.httpOptions);
  }

  update(id: number, feeRuleType: FeeRuleType): Observable<FeeRuleType> {
    return this.http.put<FeeRuleType>(`${this.apiUrl}/${id}`, feeRuleType, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<FeeRuleType[]> {
    return this.http.get<FeeRuleType[]>(`${this.apiUrl}/search?word=${word}`);
  }}
