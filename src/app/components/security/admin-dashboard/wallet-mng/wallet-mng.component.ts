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
    this.showTab('basic-info'); // or any other tabId you want as default
  }

  isWalletFormVisible: boolean = false;
  isWalletDetailsVisible: boolean = false;
  isAdvancedFilterVisible: boolean = false;

  // Toggle the visibility of the wallet creation form
  toggleWalletForm(): void {
    this.isWalletFormVisible = true;
  }
  // Optional: Method to close the form (e.g., when clicking "Cancel")
  closeWalletForm(): void {
    this.isWalletFormVisible = false;
  }

  // Toggle the visibility of the wallet creation form
  toggleWalletDetails(): void {
    this.isWalletDetailsVisible = true;
  }
  // Optional: Method to close the form (e.g., when clicking "Cancel")
  closeWalletDetails(): void {
    this.isWalletDetailsVisible = false;
  }

  // Toggle the advanced filter
  toggleAdvancedFilter(): void {
    this.isAdvancedFilterVisible = true;
  }

  showTab(tabId: string): void {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Reset all buttons and contents
    tabButtons.forEach(btn => {
      btn.classList.remove('active', 'text-primary', 'font-medium');
      btn.classList.add('text-gray-500');
    });

    tabContents.forEach(content => content.classList.add('hidden'));

    // Activate the clicked button and show its tab content
    const activeButton = document.getElementById(tabId);
    activeButton?.classList.add('active', 'text-primary', 'font-medium');
    activeButton?.classList.remove('text-gray-500');

    const activeContent = document.getElementById(`tab-${tabId}`);
    activeContent?.classList.remove('hidden');
  }

}