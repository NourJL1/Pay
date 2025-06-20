import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { WalletService } from '../../../services/wallet.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

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
    private authService: AuthService,
    private walletService: WalletService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await firstValueFrom(
        this.authService.login(this.username, this.cusMotDePasse)
      );

      console.log('Full login response:', response);

      // ✅ Stocker les infos dans le localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('cusCode', response.cusCode);
      localStorage.setItem('role', response.role?.name || 'CUSTOMER');
      localStorage.setItem('username', response.username);
      localStorage.setItem('fullname', response.fullname);

      const role = (response.role?.name || 'CUSTOMER').toLowerCase();

      if (role === 'admin') {
        console.log('Redirecting to admin dashboard');
        await this.router.navigate(['/account/dashboard']);
      } else {
        console.log('Checking wallet status');

        try {
          const walletStatus = await firstValueFrom(this.walletService.getWalletStatus());
          console.log('Wallet Status:', walletStatus);

          const status = walletStatus.wstLabe?.trim().toUpperCase();
          console.log('Wallet status label:', status);

          if (status === 'PENDING') {
            console.log('Redirecting to /pending');
            await this.router.navigate(['/pending']);
          } else if (status === 'ACTIVE') {
            console.log('Redirecting to /welcome');
            await this.router.navigate(['/welcome']);
          } else {
            this.errorMessage = 'Unknown wallet status: ' + status;
            console.warn('Unexpected wallet status:', status);
          }
        } catch (walletError) {
          console.error('Wallet status error:', walletError);
          this.errorMessage = 'Unable to fetch wallet status.';
          await this.router.navigate(['/pending']);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'Login failed. Please check your credentials.';
    } finally {
      this.isLoading = false;
    }
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
