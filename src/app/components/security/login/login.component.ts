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

  constructor(
    private authService: AuthService,
    private walletService: WalletService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    try {
      const response = await firstValueFrom(this.authService.login(this.username, this.cusMotDePasse));
      console.log('Full login response:', response);

      // Extract role (adjust if role is an object)
      const role = typeof response.role === 'string' ? response.role.toLowerCase() : response.role?.name?.toLowerCase() || 'customer';

      if (!role) {
        this.errorMessage = 'No role found in response.';
        return;
      }

      localStorage.setItem('cusCode', response.cusCode);
      localStorage.setItem('role', role);
      localStorage.setItem('username', response.username || 'CUSTOMER');

      console.log('Stored Role:', localStorage.getItem('role'));

      if (role === 'admin') {
        console.log('Redirecting to admin dashboard');
        await this.router.navigate(['/account/dashboard']);
      } else {
        console.log('Checking wallet status');
        const walletStatus = await firstValueFrom(this.walletService.getWalletStatus());
        console.log('Wallet Status:', walletStatus);

        if (walletStatus.wstIden === 'ACTIVE') {
          await this.router.navigate(['/wallet']);
        } else {
          await this.router.navigate(['/pending']);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'Login failed. Please check your credentials or try again later.';
    }
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}