import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WalletService } from '../../../../services/wallet.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true, // si tu es en standalone
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  providers: [DatePipe] // ajoute cette ligne
})
export class WelcomeComponent implements OnInit, OnDestroy {
  wallet: any = null;
  loading = true;
  error: string | null = null;
  private statusCheckSubscription?: Subscription;
  today: Date = new Date();
  username: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || 'CUSTOMER';
    this.loadCustomerWallet();
  }

  loadCustomerWallet(): void {
    this.loading = true;
    this.error = null;

    const cusCode = localStorage.getItem('cusCode');
    if (!cusCode) {
      this.error = 'Customer not authenticated';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    const url = `http://localhost:8081/api/wallets/by-customer/${cusCode}`;
    this.http.get<any>(url).subscribe({
      next: (walletData) => {
        this.wallet = walletData;
        this.loading = false;
        console.log('Wallet loaded:', walletData);
      },
      error: (err) => {
        console.error('Failed to load wallet:', err);
        this.error = 'Erreur lors du chargement du portefeuille.';
        this.loading = false;
      }
    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    if (this.statusCheckSubscription) {
      this.statusCheckSubscription.unsubscribe();
    }
  }
}
