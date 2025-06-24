import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { WalletStatusService } from '../../../services/wallet-status.service';
import { WalletStatus } from '../../../entities/wallet-status';
import { WalletCategoryService } from '../../../services/wallet-category.service';
import { WalletCategory } from '../../../entities/wallet-category';

@Component({
  selector: 'app-wallet-mng',
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet-mng.component.html',
  styleUrl: './wallet-mng.component.css',
  standalone: true
})
export class WalletMngComponent implements OnInit {
  walletStatuses: WalletStatus[] = [];
  isWalletStatusVisible: boolean = false;
  selectedStatus: WalletStatus = new WalletStatus();
  isStatusEditMode: boolean = false;

  walletCategories: WalletCategory[] = [];
  isWalletCategoryVisible: boolean = false;
  selectedCategory: WalletCategory = new WalletCategory();
  isCategoryEditMode: boolean = false;

  errorMessage: string | null = null;

  isWalletFormVisible: boolean = false;
  isWalletDetailsVisible: boolean = false;
  isWalletTypeVisible: boolean = false;
  isCardFormVisible: boolean = false;
  isCardTypeVisible: boolean = false;
  isCardListVisible: boolean = false;
  isAccountFormVisible: boolean = false;
  isAccountTypeVisible: boolean = false;
  isAccountListVisible: boolean = false;

  constructor(
    private walletStatusService: WalletStatusService,
    private walletCategoryService: WalletCategoryService
  ) {}

  ngOnInit(): void {
    this.loadWalletStatuses();
    this.loadWalletCategories();
  }

  loadWalletStatuses(): void {
    this.errorMessage = null;
    this.walletStatusService.getAll().subscribe({
      next: (statuses: WalletStatus[]) => {
        this.walletStatuses = statuses;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = `Failed to load wallet statuses: ${error.status} ${error.statusText}`;
        console.error('Error loading wallet statuses:', error.message, error);
      }
    });
  }

  loadWalletCategories(): void {
    this.errorMessage = null;
    this.walletCategoryService.getAll().subscribe({
      next: (categories: WalletCategory[]) => {
        this.walletCategories = categories;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = `Failed to load wallet categories: ${error.status} ${error.statusText}`;
        console.error('Error loading wallet categories:', error.message, error);
      }
    });
  }

  toggleForm(modal: string): void {
    this.errorMessage = null;
    switch (modal) {
      case 'create-wallet': this.isWalletFormVisible = true; break;
      case 'wallet-details': this.isWalletDetailsVisible = true; break;
      case 'wallet-status': 
        this.isWalletStatusVisible = true;
        this.isStatusEditMode = false;
        this.selectedStatus = new WalletStatus();
        break;
      case 'wallet-type': this.isWalletTypeVisible = true; break;
      case 'wallet-category':
        this.isWalletCategoryVisible = true;
        this.isCategoryEditMode = false;
        this.selectedCategory = new WalletCategory();
        break;
      case 'create-card': this.isCardFormVisible = true; break;
      case 'card-type': this.isCardTypeVisible = true; break;
      case 'card-list': this.isCardListVisible = true; break;
      case 'create-account': this.isAccountFormVisible = true; break;
      case 'account-type': this.isAccountTypeVisible = true; break;
      case 'account-list': this.isAccountListVisible = true; break;
    }
  }

  closeForm(modal: string): void {
    this.errorMessage = null;
    switch (modal) {
      case 'create-wallet': this.isWalletFormVisible = false; break;
      case 'wallet-details': this.isWalletDetailsVisible = false; break;
      case 'wallet-status': 
        this.isWalletStatusVisible = false;
        this.selectedStatus = new WalletStatus();
        break;
      case 'wallet-type': this.isWalletTypeVisible = false; break;
      case 'wallet-category':
        this.isWalletCategoryVisible = false;
        this.selectedCategory = new WalletCategory();
        break;
      case 'create-card': this.isCardFormVisible = false; break;
      case 'card-type': this.isCardTypeVisible = false; break;
      case 'card-list': this.isCardListVisible = false; break;
      case 'create-account': this.isAccountFormVisible = false; break;
      case 'account-type': this.isAccountTypeVisible = false; break;
      case 'account-list': this.isAccountListVisible = false; break;
    }
  }

  saveStatus(): void {
    this.errorMessage = null;
    if (this.isStatusEditMode) {
      this.walletStatusService.update(this.selectedStatus.wstCode, this.selectedStatus).subscribe({
        next: () => {
          this.loadWalletStatuses();
          this.closeForm('wallet-status');
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Failed to update wallet status: ${error.status} ${error.statusText}`;
          console.error('Error updating wallet status:', error.message, error);
        }
      });
    } else {
      this.walletStatusService.create(this.selectedStatus).subscribe({
        next: () => {
          this.loadWalletStatuses();
          this.closeForm('wallet-status');
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Failed to create wallet status: ${error.status} ${error.statusText}`;
          console.error('Error creating wallet status:', error.message, error);
        }
      });
    }
  }

  saveCategory(): void {
    this.errorMessage = null;
    // Validate payload
    if (!this.selectedCategory.wcaIden || !this.selectedCategory.wcaLabe || !this.selectedCategory.wcaFinId) {
      this.errorMessage = 'Please fill in all required fields: Identifier, Label, and Financial Institution ID';
      return;
    }
    console.debug('Creating/Updating category:', this.selectedCategory);
    if (this.isCategoryEditMode) {
      this.walletCategoryService.update(this.selectedCategory.wcaCode!, this.selectedCategory).subscribe({
        next: () => {
          this.loadWalletCategories();
          this.closeForm('wallet-category');
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Failed to update wallet category: ${error.status} ${error.statusText}`;
          console.error('Error updating wallet category:', error.message, error);
        }
      });
    } else {
      this.walletCategoryService.create(this.selectedCategory).subscribe({
        next: () => {
          this.loadWalletCategories();
          this.closeForm('wallet-category');
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Failed to create wallet category: ${error.status} ${error.statusText}`;
          console.error('Error creating wallet category:', error.message, error);
        }
      });
    }
  }

  editStatus(status: WalletStatus): void {
    this.errorMessage = null;
    this.selectedStatus = { ...status };
    this.isStatusEditMode = true;
    this.isWalletStatusVisible = true;
  }

  editCategory(category: WalletCategory): void {
    this.errorMessage = null;
    this.selectedCategory = { ...category };
    this.isCategoryEditMode = true;
    this.isWalletCategoryVisible = true;
  }

  deleteStatus(id: number): void {
    this.errorMessage = null;
    if (confirm('Are you sure you want to delete this status?')) {
      this.walletStatusService.delete(id).subscribe({
        next: () => {
          this.loadWalletStatuses();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Failed to delete wallet status: ${error.status} ${error.statusText}`;
          console.error('Error deleting wallet status:', error.message, error);
        }
      });
    }
  }

  deleteCategory(id: number): void {
    this.errorMessage = null;
    if (confirm('Are you sure you want to delete this category?')) {
      this.walletCategoryService.delete(id).subscribe({
        next: () => {
          this.loadWalletCategories();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Failed to delete wallet category: ${error.status} ${error.statusText} (${error.message})`;
          console.error('Error deleting wallet category:', error.message, error);
        }
      });
    }
  }

  showTab(tabId: string, tabType?: string): void {
    const buttonClass = tabType ? `${tabType}-tab-button` : 'tab-button';
    const contentClass = tabType ? `${tabType}-tab-content` : 'tab-content';
    const tabButtons = document.querySelectorAll(`.${buttonClass}`);
    const tabContents = document.querySelectorAll(`.${contentClass}`);

    tabButtons.forEach(btn => {
      btn.classList.remove('active', 'text-primary', 'font-medium');
      btn.classList.add('text-gray-500');
    });

    tabContents.forEach(content => content.classList.add('hidden'));

    const activeButton = tabType ? document.getElementById(tabType + '-' + tabId) : document.getElementById(tabId);
    activeButton?.classList.add('active', 'text-primary', 'font-medium');
    activeButton?.classList.remove('text-gray-500');

    const activeId = tabType ? `${tabType}-tab-${tabId}` : `tab-${tabId}`;
    const activeContent = document.getElementById(activeId);
    activeContent?.classList.remove('hidden');
  }

  get isAnyModalVisible(): boolean {
    return (
      this.isWalletDetailsVisible ||
      this.isWalletFormVisible ||
      this.isWalletStatusVisible ||
      this.isWalletTypeVisible ||
      this.isWalletCategoryVisible ||
      this.isCardFormVisible ||
      this.isCardTypeVisible ||
      this.isCardListVisible ||
      this.isAccountFormVisible ||
      this.isAccountTypeVisible ||
      this.isAccountListVisible
    );
  }
}