import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FeeRule } from '../entities/fee-rule';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeeRuleService {
  private apiUrl = `${environment.apiUrl}/api/fee-rule`;

  constructor(private http: HttpClient) {}

  private getHttpOptions(): { headers: HttpHeaders } {
    const role = localStorage.getItem('role') || 'ROLE_ADMIN';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Roles': role
      })
    };
  }

  getAll(): Observable<FeeRule[]> {
    return this.http.get<FeeRule[]>(this.apiUrl, this.getHttpOptions());
  }

  getById(id: number): Observable<FeeRule> {
    return this.http.get<FeeRule>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  create(feeRule: FeeRule, httpOptions?: { headers: HttpHeaders }): Observable<FeeRule> {
    return this.http.post<FeeRule>(this.apiUrl, feeRule, httpOptions || this.getHttpOptions());
  }

  update(id: number, feeRule: FeeRule, httpOptions?: { headers?: HttpHeaders }): Observable<FeeRule> {
    return this.http.put<FeeRule>(`${this.apiUrl}/${id}`, feeRule, httpOptions || this.getHttpOptions());
  }

  delete(id: number, httpOptions?: { headers?: HttpHeaders }): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, httpOptions || this.getHttpOptions()).pipe(
      catchError((err) => {
        console.error('delete: Error:', err.status, err.message);
        throw err;
      })
    );
  }

  search(word: string): Observable<FeeRule[]> {
    return this.http.get<FeeRule[]>(`${this.apiUrl}/search?word=${word}`, this.getHttpOptions());
  }
}