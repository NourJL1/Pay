import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VatRate } from '../entities/vat-rate';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VatRateService {
  private apiUrl = `${environment.apiUrl}/api/vat-rates`;

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

  getAll(): Observable<VatRate[]> {
    return this.http.get<VatRate[]>(this.apiUrl, this.getHttpOptions());
  }

  getByCode(vatCode: number, vatActive: number = 1): Observable<VatRate> {
    return this.http.get<VatRate>(`${this.apiUrl}/${vatCode}?vatActive=${vatActive}`, this.getHttpOptions());
  }

  create(vatRate: VatRate): Observable<VatRate> {
    return this.http.post<VatRate>(this.apiUrl, vatRate, this.getHttpOptions());
  }

  update(vatCode: number, vatRate: VatRate): Observable<VatRate> {
    return this.http.put<VatRate>(`${this.apiUrl}/${vatCode}`, vatRate, this.getHttpOptions());
  }

  delete(vatCode: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${vatCode}`, this.getHttpOptions());
  }
}