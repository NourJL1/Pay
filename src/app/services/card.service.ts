import { Injectable } from '@angular/core';
import { Card } from '../entities/card';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CardService {

private apiUrl = `${environment.apiUrl}/api/cards`;

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAll(): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrl);
  }

  getById(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/${id}`);
  }

  create(card: Card): Observable<Card> {
    return this.http.post<Card>(this.apiUrl, card, this.httpOptions);
  }

  update(id: number, card: Card): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${id}`, card, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/search?word=${word}`);
  }}
