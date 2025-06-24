import { Injectable } from '@angular/core';
import { VatRate } from '../entities/vat-rate';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class VatRateService {

 private apiUrl = `${environment.apiUrl}/api/vat-rates`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<VatRate[]> {
    return this.http.get<VatRate[]>(this.apiUrl);
  }

  getByCode(vatCode: number, vatActive: number = 1): Observable<VatRate> {
    return this.http.get<VatRate>(`${this.apiUrl}/${vatCode}?vatActive=${vatActive}`);
  }

  create(vatRate: VatRate): Observable<VatRate> {
    return this.http.post<VatRate>(this.apiUrl, vatRate, this.httpOptions);
  }

  update(vatCode: number, vatRate: VatRate): Observable<VatRate> {
    return this.http.put<VatRate>(`${this.apiUrl}/${vatCode}`, vatRate, this.httpOptions);
  }

  delete(vatCode: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${vatCode}`, this.httpOptions);
  }}
