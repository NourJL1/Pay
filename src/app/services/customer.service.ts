import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role } from '../entities/role';
import { WalletStatus } from '../entities/wallet-status';
import { Customer } from '../entities/customer';

export interface LocalCustomer {
  cusCode?: number;
  username: string;
  cusMotDePasse: string;
  fullname: string;
  cusMailAdress: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customers`;
  private loggedInCustomerId: number | null = null;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const roles: Role[] = JSON.parse(localStorage.getItem('roles') || '[]');
    const rolesString = roles.map((role) => role.name).join(',');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Roles': rolesString
      }),
    };
  }

  // Register a new customer
  register(customer: LocalCustomer): Observable<Customer> {
    return this.http.post<Customer>(
      `${this.apiUrl}/register`,
      customer,
      this.getHttpOptions()
    );
  }

  // Get customer details by username
  getCustomer(username: string): Observable<Customer> {
    return this.http.get<Customer>(
      `${this.apiUrl}/${username}`,
      this.getHttpOptions()
    );
  }

  // Get customer details by ID
  getCustomerById(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(
      `${this.apiUrl}/id/${customerId}`,
      this.getHttpOptions()
    );
  }

  // Update customer information
  updateCustomer(username: string, customer: LocalCustomer): Observable<Customer> {
    return this.http.put<Customer>(
      `${this.apiUrl}/${username}`,
      customer,
      this.getHttpOptions()
    );
  }

  // Assign roles to a customer
  assignRoles(username: string, roleIds: number[]): Observable<Customer> {
    console.log('Assigning roles to customer:', username);
    console.log('Roles:', roleIds);

    return this.http.put<Customer>(
      `${this.apiUrl}/${username}/assignRoles`,
      roleIds,
      this.getHttpOptions()
    );
  }

  setLoggedInUserId(customerId: number): void {
    this.loggedInCustomerId = customerId;
  }

  getLoggedInUserId(): number | null {
    return this.loggedInCustomerId;
  }

  clearLoggedInUserId(): void {
    this.loggedInCustomerId = null;
  }

  // Delete customer by username
  deleteCustomer(username: string): Observable<void> {
    return this.http.delete<any>(
      `${this.apiUrl}/${username}`,
      this.getHttpOptions()
    );
  }

  // Get all customers
  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}`);
  }

  // Update wallet status
  updateWalletStatus(walletId: number, status: WalletStatus): Observable<any> {
    return this.http.patch(
      `${environment.apiUrl}/wallet/${walletId}/status`,
      { status },
      this.getHttpOptions()
    );
  }
}

export { Customer };
