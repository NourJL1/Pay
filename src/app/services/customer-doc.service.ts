import { Injectable } from '@angular/core';
import { CustomerDoc } from '../entities/customer-doc';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerDocService {

  private apiUrl = `${environment.apiUrl}/api/customer-doc`;

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAll(): Observable<CustomerDoc[]> {
    return this.http.get<CustomerDoc[]>(this.apiUrl);
  }

  getById(id: number): Observable<CustomerDoc> {
    return this.http.get<CustomerDoc>(`${this.apiUrl}/${id}`);
  }

  getFileById(id: number) {
    return this.http.get(`${this.apiUrl}/file/${id}`, { responseType: 'blob', observe: 'response' }).subscribe(response => {
      const file = response.body!;
      var url = URL.createObjectURL(file);
      const fileType = response.headers.get('Content-Type') || 'application/octet-stream';

      if (fileType.includes('office') || fileType.includes('msword')) {
        const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
        window.open(officeViewerUrl, '_blank');
      }

      else{const previewUrl = `/assets/preview.html?url=${encodeURIComponent(url)}&type=${encodeURIComponent(fileType)}`;
      const viewer = window.open(previewUrl, '_blank', `
      width=1000,height=700,
      toolbar=no,
      location=no,
      status=no,
      menubar=no
    `);

      // Clean up when window closes
      viewer!.onbeforeunload = () => URL.revokeObjectURL(url);}
    });
  }

  getByCustomerDocListe(cdlIden: number) {
    //return this.http.get(`${this.apiUrl}/cdl/${cdlIden}`);
    return this.http.get<CustomerDoc[]>(`${this.apiUrl}/cdl/${cdlIden}`);
  }

  /* create(customerDoc: CustomerDoc): Observable<CustomerDoc> {
    return this.http.post<CustomerDoc>(this.apiUrl, customerDoc, this.httpOptions);
  } */

  create(customerDoc: CustomerDoc, file: File) {

    const formData = new FormData()
    formData.append('customerDoc', JSON.stringify(customerDoc))
    formData.append('file', file)
    return this.http.post<CustomerDoc>(this.apiUrl, formData);
  }

  update(id: number, customerDoc: CustomerDoc): Observable<CustomerDoc> {
    return this.http.put<CustomerDoc>(`${this.apiUrl}/${id}`, customerDoc, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  search(word: string): Observable<CustomerDoc[]> {
    return this.http.get<CustomerDoc[]>(`${this.apiUrl}/search?word=${word}`);
  }
}
