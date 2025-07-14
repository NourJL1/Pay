import { Component } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Wallet } from '../../entities/wallet';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  cusMotDePasse: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private customerService: CustomerService,
    private walletService: WalletService,
    private router: Router
  ) { }

  ngOnInit(): void {
    localStorage.clear()
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.customerService.login(this.username, this.cusMotDePasse).subscribe({
      next: (response) => {

        // Store user data in localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('cusCode', response.cusCode);
        localStorage.setItem('role', response.role?.name || 'CUSTOMER');
        localStorage.setItem('roles', response.roles || ['ROLE_CUSTOMER']); // Fallback to ROLE_CUSTOMER
        localStorage.setItem('username', response.username);
        localStorage.setItem('fullname', response.fullname || '');
        localStorage.setItem('status', response.status || 'PENDING');

        const role = (response.role?.name || 'CUSTOMER');

        if (role === 'ADMIN')
          this.router.navigate(['/admin/dashboard']);
        else {

          if (response.status === 'PENDING') 
            this.router.navigate(['/pending']);

          else if (response.status === 'ACTIVE') {
            this.walletService.getWalletByCustomerCode(response.cusCode).subscribe({
              next: (walletData: Wallet) => {
                const statusLabel = walletData.walletStatus?.wstLabe?.trim().toUpperCase();

                if (statusLabel === 'ACTIVE') {
                  this.router.navigate(['/wallet']);
                } else {
                  this.errorMessage = 'Unknown wallet status: ' + statusLabel;
                }
              },
              error: (err) => {
                console.error('Error fetching wallet data:', err);
                this.errorMessage = 'Failed to fetch wallet data.';
              }
            });
          } else {
            this.errorMessage = 'Unknown customer status: ' + response.status.ctsLabe;
            console.warn('Unexpected customer status:', response.status.ctsLabe);
          }
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = 'Login failed. Please check your credentials.';
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
