import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OperationType } from '../entities/operation-type';

@Injectable({
  providedIn: 'root'
})
export class OperationTypeService {

 private apiUrl = `${environment.apiUrl}/operation-types`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<OperationType[]> {
    return this.http.get<OperationType[]>(this.apiUrl);
  }

  getById(id: number): Observable<OperationType> {
    return this.http.get<OperationType>(`${this.apiUrl}/${id}`);
  }

  create(operationType: OperationType): Observable<OperationType> {
    return this.http.post<OperationType>(this.apiUrl, operationType, this.httpOptions);
  }

  update(id: number, operationType: OperationType): Observable<OperationType> {
    return this.http.put<OperationType>(`${this.apiUrl}/${id}`, operationType, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<OperationType[]> {
    return this.http.get<OperationType[]>(`${this.apiUrl}/search?word=${word}`);
  }}
