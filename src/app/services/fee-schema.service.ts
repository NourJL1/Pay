import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeeSchema } from '../entities/fee-schema';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FeeSchemaService {

private apiUrl = `${environment.apiUrl}/fee-schemas`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<FeeSchema[]> {
    return this.http.get<FeeSchema[]>(this.apiUrl);
  }

  getById(id: number): Observable<FeeSchema> {
    return this.http.get<FeeSchema>(`${this.apiUrl}/${id}`);
  }

  create(feeSchema: FeeSchema): Observable<FeeSchema> {
    return this.http.post<FeeSchema>(this.apiUrl, feeSchema, this.httpOptions);
  }

  update(id: number, feeSchema: FeeSchema): Observable<FeeSchema> {
    return this.http.put<FeeSchema>(`${this.apiUrl}/${id}`, feeSchema, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<FeeSchema[]> {
    return this.http.get<FeeSchema[]>(`${this.apiUrl}/search?word=${word}`);
  }}
