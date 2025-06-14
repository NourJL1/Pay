import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
@Component({
  selector: 'app-wallet-mng',
  imports: [CommonModule],
  templateUrl: './wallet-mng.component.html',
  styleUrl: './wallet-mng.component.css'
})
export class WalletMngComponent {

  ngOnInit(): void {
  }

  isWalletFormVisible: boolean = false;
  isWalletDetailsVisible: boolean = false;
  isWalletStatusVisible: boolean = false;
  isWalletTypeVisible: boolean = false;
  isWalletCategoryVisible: boolean = false;
  isCardFormVisible: boolean = false;
  isCardTypeVisible: boolean = false;
  isCardListVisible: boolean = false;
  isAccountFormVisible: boolean = false;
  isAccountTypeVisible: boolean = false;
  isAccountListVisible: boolean = false;

  toggleForm(modal: String): void {
    switch (modal) {
      case 'create-wallet': this.isWalletFormVisible = true; break;
      case 'wallet-details': this.isWalletDetailsVisible = true; break;
      case 'wallet-status': this.isWalletStatusVisible = true; break;
      case 'wallet-type': this.isWalletTypeVisible = true; break;
      case 'wallet-category': this.isWalletCategoryVisible = true; break;
      case 'create-card': this.isCardFormVisible = true; break;
      case 'card-type': this.isCardTypeVisible = true; break;
      case 'card-list': this.isCardListVisible = true; break;
      case 'create-account': this.isAccountFormVisible = true; break;
      case 'account-type': this.isAccountTypeVisible = true; break;
      case 'account-list': this.isAccountListVisible = true; break;
    }
  }

  closeForm(modal: String): void {
    switch (modal) {
      case 'create-wallet': this.isWalletFormVisible = false; break;
      case 'wallet-details': this.isWalletDetailsVisible = false; break;
      case 'wallet-status': this.isWalletStatusVisible = false; break;
      case 'wallet-type': this.isWalletTypeVisible = false; break;
      case 'wallet-category': this.isWalletCategoryVisible = false; break;
      case 'create-card': this.isCardFormVisible = false; break;
      case 'card-type': this.isCardTypeVisible = false; break;
      case 'card-list': this.isCardListVisible = false; break;
      case 'create-account': this.isAccountFormVisible = false; break;
      case 'account-type': this.isAccountTypeVisible = false; break;
      case 'account-list': this.isAccountListVisible = false; break;
    }
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

  showTab(tabId: string, tabType?: string): void {

    const buttonClass = tabType ? `${tabType}-tab-button` : 'tab-button';
    const contentClass = tabType ? `${tabType}-tab-content` : 'tab-content';
    const tabButtons = document.querySelectorAll(`.${buttonClass}`);
    const tabContents = document.querySelectorAll(`.${contentClass}`);

    // Reset all buttons and contents
    tabButtons.forEach(btn => {
      btn.classList.remove('active', 'text-primary', 'font-medium');
      btn.classList.add('text-gray-500');
    });

    tabContents.forEach(content => content.classList.add('hidden'));

    // Activate the clicked button and show its tab content
    const activeButton = tabType ? document.getElementById(tabType+'-'+tabId) : document.getElementById(tabId);
    activeButton?.classList.add('active', 'text-primary', 'font-medium');
    activeButton?.classList.remove('text-gray-500');

    const activeId = tabType ? `${tabType}-tab-${tabId}` : `tab-${tabId}`;
    const activeContent = document.getElementById(activeId);
    activeContent?.classList.remove('hidden');
  }

}