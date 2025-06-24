import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Periodicity } from '../entities/periodicity';

@Injectable({
  providedIn: 'root'
})
export class PeriodicityService {

 private apiUrl = `${environment.apiUrl}/api/periodicities`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<Periodicity[]> {
    return this.http.get<Periodicity[]>(this.apiUrl);
  }

  getById(id: number): Observable<Periodicity> {
    return this.http.get<Periodicity>(`${this.apiUrl}/${id}`);
  }

  create(periodicity: Periodicity): Observable<Periodicity> {
    return this.http.post<Periodicity>(this.apiUrl, periodicity, this.httpOptions);
  }

  update(id: number, periodicity: Periodicity): Observable<Periodicity> {
    return this.http.put<Periodicity>(`${this.apiUrl}/${id}`, periodicity, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<Periodicity[]> {
    return this.http.get<Periodicity[]>(`${this.apiUrl}/search?word=${word}`);
  }}
