import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CardList } from '../entities/card-list';



@Injectable({
  providedIn: 'root'
})
export class CardListService {

  private apiUrl = `${environment.apiUrl}/card-lists`;

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAll(): Observable<CardList[]> {
    return this.http.get<CardList[]>(this.apiUrl);
  }

  getById(id: number): Observable<CardList> {
    return this.http.get<CardList>(`${this.apiUrl}/${id}`);
  }

  create(cardList: CardList): Observable<CardList> {
    return this.http.post<CardList>(this.apiUrl, cardList, this.httpOptions);
  }

  update(id: number, cardList: CardList): Observable<CardList> {
    return this.http.put<CardList>(`${this.apiUrl}/${id}`, cardList, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<CardList[]> {
    return this.http.get<CardList[]>(`${this.apiUrl}/search?word=${word}`);
  }}
