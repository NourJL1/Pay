import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { WalletService } from '../../../services/wallet.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./login.component.css'],
  standalone: true
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
cusMotDePasse: any;

  constructor(
    private authService: AuthService,
    private walletService: WalletService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      // 1. First authenticate the user
      const authResponse = await firstValueFrom(
        this.authService.login(this.username, this.password)
      );

      // 2. Store the authentication token if available
      if (authResponse.token) {
        localStorage.setItem('token', authResponse.token);
      }

      // 3. Handle redirection based on role
      const role = authResponse.role?.toLowerCase() || 'customer';
      localStorage.setItem('role', role);
      localStorage.setItem('cusCode', authResponse.cusCode);

      if (role === 'admin') {
        await this.router.navigate(['/account/dashboard']);
      } else {
        await this.handleCustomerRedirect(authResponse.cusCode);
      }

    } catch (error: unknown) {
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private async handleCustomerRedirect(cusCode: number): Promise<void> {
    try {
      const wallets = await firstValueFrom(
        this.walletService.getWalletsByCustomerCode(cusCode)
      );

      if (!wallets?.length) {
        throw new Error('No wallet found for this user');
      }

      const status = wallets[0].walletStatus?.wstIden?.toUpperCase();
      switch (status) {
        case 'ACTIVE':
          await this.router.navigate(['/wallet']);
          break;
        case 'PENDING':
          await this.router.navigate(['/pending']);
          break;
        default:
          throw new Error(`Wallet status: ${status}`);
      }
    } catch (error) {
      console.error('Wallet redirect error:', error);
      throw error;
    }
  }

  private handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          this.errorMessage = 'Network error - please check your connection';
          break;
        case 403:
          this.errorMessage = 'Access forbidden - invalid credentials or insufficient permissions';
          break;
        case 401:
          this.errorMessage = 'Invalid username or password';
          break;
        default:
          this.errorMessage = `Server error (${error.status}) - please try again later`;
      }
    } else if (error instanceof Error) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'An unknown error occurred';
    }
    
    console.error('Login error:', error);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}