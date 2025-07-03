import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { Subscription, interval, switchMap } from 'rxjs';

@Component({
  selector: 'app-wallet',
  standalone: true,
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
  imports: [CommonModule, RouterOutlet, RouterModule]
})
export class WalletComponent implements OnInit, OnDestroy {
  wallet: any = null;
  loading = true;
  error: string | null = null;
  private statusCheckSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private walletService: WalletService
  ) { }

  ngOnInit() {
    this.loadWallet();
    this.username = localStorage.getItem('username') || 'User';
    // Set up periodic status checking (every 30 seconds)
    /* this.statusCheckSubscription = interval(30000).pipe(
      switchMap(() => this.walletService.getWalletStatus())
    ).subscribe({
      next: (status) => {
        if (status == 'PENDING') {
          this.router.navigate(['wallet/welcome']);
        }
      },
      error: (err) => console.error('Status check failed', err)
    }); */
  }

  loadWallet() {
    this.loading = true;
    this.error = null;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.error = 'User not authenticated';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    this.http.get(`http://localhost:8080/api/wallet/users/${userId}`).subscribe({
      next: (data: any) => {
        this.wallet = data;
        this.loading = false;
        console.log('status:', data.status);
        // If wallet status isn't approved, redirect to welcome
        /* if (data.status == 'ACTIVE') {
          this.router.navigate(['/wallet/welcome']);
        } */
      },
      error: (err) => {
        console.error('Failed to load wallet', err);
        this.error = 'Failed to load wallet data';
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.statusCheckSubscription) {
      this.statusCheckSubscription.unsubscribe();
    }
  }

  logout() {
    // Clear user data
    //localStorage.removeItem('userId');
    //localStorage.removeItem('authToken');
    localStorage.clear()

    // Redirect to login page
    this.router.navigate(['/home']);
  }

  today: Date = new Date();

  username: string = '';


}