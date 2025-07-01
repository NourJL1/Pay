import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Wallet } from '../../entities/wallet';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { WalletType } from '../../entities/wallet-type';
import { WalletTypeService } from '../../services/wallet-type.service';
import { WalletCategory } from '../../entities/wallet-category';
import { WalletCategoryService } from '../../services/wallet-category.service';
import { WalletService } from '../../services/wallet.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-wallet-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet-form.component.html',
  styleUrl: './wallet-form.component.css'
})
export class WalletFormComponent {


  currentStep = 1;
  wallet: Wallet = new Wallet()
  errorMessage: string = '';
  successMessage: string = '';
  walletCategories: WalletCategory[] = [];
  addCard: boolean = false;
  card: any;
  cardTypes: any;
  addAccount: boolean = false;
  account: any;
  banks: any;
  accountTypes: any;
  walletTypes: WalletType[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private walletService: WalletService,
    private walletTypeService: WalletTypeService,
    private walletCategoryService: WalletCategoryService
  ) { }

  ngOnInit(): void {

    this.walletTypeService.getAll().subscribe(
      {
        next: (types: WalletType[]) => { this.walletTypes = types; },
        error: (err) => { console.log(err) }
      }
    );

    this.walletCategoryService.getAll().subscribe(
      {
        next: (categories: WalletCategory[]) => { this.walletCategories = categories; },
        error: (err) => { console.log(err) }
      }
    );
  }

  createWallet() {

    
    this.walletService.create(this.wallet).subscribe({
      next: (wallet: Wallet) => {
        console.log(wallet)
        this.successMessage = 'Wallet created successfully'
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.log(err)
        this.errorMessage = 'Wallet creation failed!'
      }
    })
  }

  goToNextStep() {
    console.log(this.wallet)

    if (this.currentStep === 1) {
      if (!this.wallet.walLabe || !this.wallet.walletCategory || !this.wallet.walletType) {
        this.errorMessage = 'please fill the form'
        return;
      }
    }
    // Clear any previous error and go to the next step
    this.errorMessage = '';
    this.currentStep++;
  }

  goToPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

}
