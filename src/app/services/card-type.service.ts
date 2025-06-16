import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CardType } from '../entities/card-type';



@Injectable({
  providedIn: 'root'
})
export class CardTypeService {

private apiUrl = `${environment.apiUrl}/card-types`;

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };

  constructor(private http: HttpClient) {}

  findAll(): Observable<CardType[]> {
    return this.http.get<CardType[]>(this.apiUrl);
  }

  findById(id: number): Observable<CardType> {
    return this.http.get<CardType>(`${this.apiUrl}/${id}`);
  }

  save(cardType: CardType): Observable<CardType> {
    if (cardType.ctypCode) {
      // If id exists, update
      return this.http.put<CardType>(`${this.apiUrl}/${cardType.ctypCode}`, cardType, this.httpOptions);
    } else {
      // Else, create
      return this.http.post<CardType>(this.apiUrl, cardType, this.httpOptions);
    }
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  searchCardTypes(word: string): Observable<CardType[]> {
    return this.http.get<CardType[]>(`${this.apiUrl}/search?word=${word}`);
  }}
