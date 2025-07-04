import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role } from '../entities/role';
import { WalletStatus } from '../entities/wallet-status';
import { Customer } from '../entities/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  
  private apiUrl = `${environment.apiUrl}/api/customers`;
  private loggedInCustomerId: number | null = null;

  constructor(private http: HttpClient) { }

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
  register(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(
      `${this.apiUrl}`,
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

  // Get customer details by email
  getCustomerByEmail(email: string): Observable<Customer> {
    return this.http.get<Customer>(
      `${this.apiUrl}/email/${email}`,
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
  updateCustomer(username: string, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(
      `${this.apiUrl}/${username}`,
      customer,
      this.getHttpOptions()
    );
  }

  resetPassword(cusCode: number, password: string)
  {
    return this.http.put<string>(`${this.apiUrl}/resetPassword/${cusCode}`, password)
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

    getAllCustomersWithWallets() {
    return this.http.get<Customer[]>(`${this.apiUrl}/with-wallets`);
  }

  // Update wallet status
  updateWalletStatus(walletId: number, status: WalletStatus): Observable<any> {
    return this.http.patch(
      `${environment.apiUrl}/wallet/${walletId}/status`,
      { status },
      this.getHttpOptions()
    );
  }

  sendEmail(email: string, subject: string) {
    return this.http.post<string>(`${this.apiUrl}/sendEmail`, {
      "cusMailAdress": email,
      "subject": subject
    })
  }

  verifyOTP(email: string, code: string) {
    return this.http.post<boolean>(`${this.apiUrl}/compareTOTP`, {
      "cusMailAdress": email,
      "code": code
    })
  }

  search(criteria: any)
  {
    return this.http.get<Customer[]>(`${this.apiUrl}/search`)
  }
}

export { Customer };
