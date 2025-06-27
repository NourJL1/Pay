import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { WalletStatusService } from '../../../services/wallet-status.service';
import { WalletStatus } from '../../../entities/wallet-status';
import { WalletCategoryService } from '../../../services/wallet-category.service';
import { WalletCategory } from '../../../entities/wallet-category';
import { WalletTypeService } from '../../../services/wallet-type.service';
import { WalletType } from '../../../entities/wallet-type';

@Component({
  selector: 'app-wallet-mng',
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet-mng.component.html',
  styleUrls: ['./wallet-mng.component.css'],
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

  walletTypesList: WalletType[] = [];
  newWalletType: WalletType = new WalletType();
  selectedWalletType: WalletType | null = null;
  isWalletTypeEditMode: boolean = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;

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
    private walletCategoryService: WalletCategoryService,
    private walletTypeService: WalletTypeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit: Initializing component...');
    this.loadWalletStatuses();
    this.loadWalletCategories();
    this.loadWalletTypes();
  }

  // Get HTTP headers with optional authentication
  private getHttpOptions(includeAuth: boolean = false): { headers: HttpHeaders } {
    const role = localStorage.getItem('role') || 'ROLE_ADMIN';
    console.log('getHttpOptions: Role:', role, 'Include Auth:', includeAuth);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(includeAuth ? { 'X-Roles': role } : {})
    });
    return { headers };
  }

  // Load wallet statuses
  loadWalletStatuses(): void {
    this.errorMessage = null;
    console.log('loadWalletStatuses: Fetching wallet statuses...');
    this.walletStatusService.getAll(this.getHttpOptions()).subscribe({
      next: (statuses: WalletStatus[]) => {
        console.log('loadWalletStatuses: Wallet statuses received:', statuses);
        this.walletStatuses = statuses;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = `Failed to load wallet statuses: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`;
        console.error('Error loading wallet statuses:', error, 'Response:', error.error);
        this.cdr.detectChanges();
      }
    });
  }

  // Load wallet categories
  loadWalletCategories(): void {
    this.errorMessage = null;
    console.log('loadWalletCategories: Fetching wallet categories...');
    this.walletCategoryService.getAll(this.getHttpOptions(true)).subscribe({
      next: (categories: WalletCategory[]) => {
        console.log('loadWalletCategories: Wallet categories received:', categories);
        this.walletCategories = categories;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = `Failed to load wallet categories: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`;
        console.error('Error loading wallet categories:', error, 'Response:', error.error);
        this.cdr.detectChanges();
      }
    });
  }

  // Load wallet types
  loadWalletTypes(): void {
    this.errorMessage = null;
    console.log('loadWalletTypes: Fetching wallet types...');
    this.walletTypeService.getAll(this.getHttpOptions()).subscribe({
      next: (types: WalletType[]) => {
        console.log('loadWalletTypes: Wallet types received:', types);
        this.walletTypesList = types;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = `Failed to load wallet types: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`;
        console.error('Error loading wallet types:', error, 'Response:', error.error);
        this.cdr.detectChanges();
      }
    });
  }

  // Add a new wallet type
  addWalletType(): void {
    console.log('addWalletType: Adding wallet type:', this.newWalletType);
    if (!this.newWalletType.wtyIden || !this.newWalletType.wtyLabe) {
      this.showErrorMessage('Please fill in all required fields: Type Identifier and Type Label.');
      return;
    }
    this.walletTypeService.create(this.newWalletType, this.getHttpOptions()).subscribe({
      next: (createdWalletType: WalletType) => {
        console.log('addWalletType: Wallet type added:', createdWalletType);
        this.walletTypesList.push(createdWalletType);
        this.newWalletType = new WalletType();
        this.isWalletTypeVisible = false;
        this.showSuccessMessage('Wallet type added successfully');
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('addWalletType: Error:', err, 'Response:', err.error);
        this.showErrorMessage(`Failed to add wallet type: ${err.status} ${err.statusText} - ${err.error?.message || 'No response body'}`);
      }
    });
  }

  // Edit a wallet type
  editWalletType(type: WalletType): void {
    console.log('editWalletType: Wallet type object:', type);
    this.selectedWalletType = type;
    this.newWalletType = { ...type };
    this.isWalletTypeEditMode = true;
    this.isWalletTypeVisible = true;
    this.cdr.detectChanges();
  }

  // Update a wallet type
  updateWalletType(): void {
    console.log('updateWalletType: Updating wallet type:', this.newWalletType);
    if (!this.newWalletType.wtyIden || !this.newWalletType.wtyLabe) {
      this.showErrorMessage('Please fill in all required fields: Type Identifier and Type Label.');
      return;
    }
    if (this.selectedWalletType?.wtyCode) {
      this.walletTypeService.update(this.selectedWalletType.wtyCode, this.newWalletType, this.getHttpOptions()).subscribe({
        next: (updatedWalletType: WalletType) => {
          console.log('updateWalletType: Wallet type updated:', updatedWalletType);
          const index = this.walletTypesList.findIndex(t => t.wtyCode === updatedWalletType.wtyCode);
          if (index !== -1) {
            this.walletTypesList[index] = updatedWalletType;
            this.walletTypesList = [...this.walletTypesList];
          }
          this.newWalletType = new WalletType();
          this.selectedWalletType = null;
          this.isWalletTypeEditMode = false;
          this.isWalletTypeVisible = false;
          this.showSuccessMessage('Wallet type updated successfully');
          this.cdr.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          console.error('updateWalletType: Error:', err, 'Response:', err.error);
          this.showErrorMessage(`Failed to update wallet type: ${err.status} ${err.statusText} - ${err.error?.message || 'No response body'}`);
        }
      });
    } else {
      this.showErrorMessage('No wallet type selected for update.');
    }
  }

  // Delete a wallet type
  deleteWalletType(wtyCode: number | undefined): void {
    console.log('deleteWalletType: wtyCode:', wtyCode);
    if (wtyCode && confirm('Are you sure you want to delete this wallet type?')) {
      this.walletTypeService.delete(wtyCode, this.getHttpOptions()).subscribe({
        next: () => {
          console.log('deleteWalletType: Success, wtyCode:', wtyCode);
          this.walletTypesList = this.walletTypesList.filter(t => t.wtyCode !== wtyCode);
          this.showSuccessMessage('Wallet type deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          console.error('deleteWalletType: Error:', err, 'Response:', err.error);
          this.showErrorMessage(`Failed to delete wallet type: ${err.status} ${err.statusText} - ${err.error?.message || 'No response body'}`);
        }
      });
    }
  }

  // Save wallet type (handles both add and update)
  saveWalletType(): void {
    this.errorMessage = null;
    if (this.isWalletTypeEditMode) {
      this.updateWalletType();
    } else {
      this.addWalletType();
    }
  }

  // Save wallet status
  saveStatus(): void {
    this.errorMessage = null;
    console.log('saveStatus: Saving wallet status:', this.selectedStatus);
    if (!this.selectedStatus.wstIden || !this.selectedStatus.wstLabe) {
      this.showErrorMessage('Please fill in all required fields: Status Identifier and Status Label.');
      return;
    }
    if (this.isStatusEditMode) {
      this.walletStatusService.update(this.selectedStatus.wstCode!, this.selectedStatus, this.getHttpOptions()).subscribe({
        next: () => {
          console.log('saveStatus: Wallet status updated');
          this.loadWalletStatuses();
          this.closeForm('wallet-status');
          this.showSuccessMessage('Wallet status updated successfully');
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to update wallet status: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`);
          console.error('Error updating wallet status:', error, 'Response:', error.error);
        }
      });
    } else {
      this.walletStatusService.create(this.selectedStatus, this.getHttpOptions()).subscribe({
        next: () => {
          console.log('saveStatus: Wallet status created');
          this.loadWalletStatuses();
          this.closeForm('wallet-status');
          this.showSuccessMessage('Wallet status added successfully');
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to create wallet status: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`);
          console.error('Error creating wallet status:', error, 'Response:', error.error);
        }
      });
    }
  }

  // Save wallet category
  saveCategory(): void {
    this.errorMessage = null;
    console.log('saveCategory: Saving wallet category:', this.selectedCategory);
    if (!this.selectedCategory.wcaIden || !this.selectedCategory.wcaLabe || !this.selectedCategory.wcaFinId) {
      this.showErrorMessage('Please fill in all required fields: Identifier, Label, and Financial Institution ID.');
      return;
    }
    if (this.isCategoryEditMode) {
      this.walletCategoryService.update(this.selectedCategory.wcaCode!, this.selectedCategory, this.getHttpOptions(true)).subscribe({
        next: () => {
          console.log('saveCategory: Wallet category updated');
          this.loadWalletCategories();
          this.closeForm('wallet-category');
          this.showSuccessMessage('Wallet category updated successfully');
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to update wallet category: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`);
          console.error('Error updating wallet category:', error, 'Response:', error.error);
        }
      });
    } else {
      this.walletCategoryService.create(this.selectedCategory, this.getHttpOptions(true)).subscribe({
        next: () => {
          console.log('saveCategory: Wallet category created');
          this.loadWalletCategories();
          this.closeForm('wallet-category');
          this.showSuccessMessage('Wallet category added successfully');
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to create wallet category: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`);
          console.error('Error creating wallet category:', error, 'Response:', error.error);
        }
      });
    }
  }

  // Edit wallet status
  editStatus(status: WalletStatus): void {
    this.errorMessage = null;
    console.log('editStatus: Editing wallet status:', status);
    this.selectedStatus = { ...status };
    this.isStatusEditMode = true;
    this.isWalletStatusVisible = true;
    this.cdr.detectChanges();
  }

  // Edit wallet category
  editCategory(category: WalletCategory): void {
    this.errorMessage = null;
    console.log('editCategory: Editing wallet category:', category);
    this.selectedCategory = { ...category };
    this.isCategoryEditMode = true;
    this.isWalletCategoryVisible = true;
    this.cdr.detectChanges();
  }

  // Delete wallet status
  deleteStatus(wstCode: number | undefined): void {
    this.errorMessage = null;
    console.log('deleteStatus: wstCode:', wstCode);
    if (wstCode && confirm('Are you sure you want to delete this status?')) {
      this.walletStatusService.delete(wstCode, this.getHttpOptions()).subscribe({
        next: () => {
          console.log('deleteStatus: Success, wstCode:', wstCode);
          this.loadWalletStatuses();
          this.showSuccessMessage('Wallet status deleted successfully');
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to delete wallet status: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`);
          console.error('Error deleting wallet status:', error, 'Response:', error.error);
        }
      });
    }
  }

  // Delete wallet category
  deleteCategory(wcaCode: number | undefined): void {
    this.errorMessage = null;
    console.log('deleteCategory: wcaCode:', wcaCode);
    if (wcaCode && confirm('Are you sure you want to delete this category?')) {
      this.walletCategoryService.delete(wcaCode, this.getHttpOptions(true)).subscribe({
        next: () => {
          console.log('deleteCategory: Success, wcaCode:', wcaCode);
          this.loadWalletCategories();
          this.showSuccessMessage('Wallet category deleted successfully');
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to delete wallet category: ${error.status} ${error.statusText} - ${error.error?.message || 'No response body'}`);
          console.error('Error deleting wallet category:', error, 'Response:', error.error);
        }
      });
    }
  }

  // Show success message
  showSuccessMessage(message: string): void {
    console.log('showSuccessMessage:', message);
    this.successMessage = message;
    this.errorMessage = null;
    setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  // Show error message
  showErrorMessage(message: string): void {
    console.log('showErrorMessage:', message);
    this.errorMessage = message;
    this.successMessage = null;
    setTimeout(() => {
      this.errorMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  // Toggle form visibility
  toggleForm(modal: string): void {
    this.errorMessage = null;
    console.log('toggleForm: Opening modal:', modal);
    switch (modal) {
      case 'create-wallet':
        this.isWalletFormVisible = true;
        break;
      case 'wallet-details':
        this.isWalletDetailsVisible = true;
        break;
      case 'wallet-status':
        this.isWalletStatusVisible = true;
        this.isStatusEditMode = false;
        this.selectedStatus = new WalletStatus();
        break;
      case 'wallet-type':
        this.isWalletTypeVisible = true;
        this.isWalletTypeEditMode = false;
        this.newWalletType = new WalletType();
        this.selectedWalletType = null;
        break;
      case 'wallet-category':
        this.isWalletCategoryVisible = true;
        this.isCategoryEditMode = false;
        this.selectedCategory = new WalletCategory();
        break;
      case 'create-card':
        this.isCardFormVisible = true;
        break;
      case 'card-type':
        this.isCardTypeVisible = true;
        break;
      case 'card-list':
        this.isCardListVisible = true;
        break;
      case 'create-account':
        this.isAccountFormVisible = true;
        break;
      case 'account-type':
        this.isAccountTypeVisible = true;
        break;
      case 'account-list':
        this.isAccountListVisible = true;
        break;
    }
    this.cdr.detectChanges();
  }

  // Close form
  closeForm(modal: string): void {
    this.errorMessage = null;
    console.log('closeForm: Closing modal:', modal);
    switch (modal) {
      case 'create-wallet':
        this.isWalletFormVisible = false;
        break;
      case 'wallet-details':
        this.isWalletDetailsVisible = false;
        break;
      case 'wallet-status':
        this.isWalletStatusVisible = false;
        this.selectedStatus = new WalletStatus();
        this.isStatusEditMode = false;
        break;
      case 'wallet-type':
        this.isWalletTypeVisible = false;
        this.newWalletType = new WalletType();
        this.selectedWalletType = null;
        this.isWalletTypeEditMode = false;
        break;
      case 'wallet-category':
        this.isWalletCategoryVisible = false;
        this.selectedCategory = new WalletCategory();
        this.isCategoryEditMode = false;
        break;
      case 'create-card':
        this.isCardFormVisible = false;
        break;
      case 'card-type':
        this.isCardTypeVisible = false;
        break;
      case 'card-list':
        this.isCardListVisible = false;
        break;
      case 'create-account':
        this.isAccountFormVisible = false;
        break;
      case 'account-type':
        this.isAccountTypeVisible = false;
        break;
      case 'account-list':
        this.isAccountListVisible = false;
        break;
    }
    this.cdr.detectChanges();
  }

  // Show specific tab
  showTab(tabId: string, tabType?: string): void {
    console.log('showTab: tabId:', tabId, 'type:', tabType);
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
    this.cdr.detectChanges();
  }

  // Check if any modal is visible
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
