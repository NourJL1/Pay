import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-mng',
  imports: [CommonModule],
  templateUrl: './customer-mng.component.html',
  styleUrl: './customer-mng.component.css'
})
export class CustomerMngComponent {

  isUserDetailsVisible: boolean = false;

  toggleForm(modal: string) {
    switch (modal) {
      case 'customer-details': this.isUserDetailsVisible = true; break;
    }
  }

  closeForm(modal: string) {
    switch (modal) {
      case 'customer-details': this.isUserDetailsVisible = false; break;
    }
  }

  get isAnyModalVisible(): boolean {
    return (
      this.isUserDetailsVisible
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
    const activeButton = tabType ? document.getElementById(tabType + '-' + tabId) : document.getElementById(tabId);
    activeButton?.classList.add('active', 'text-primary', 'font-medium');
    activeButton?.classList.remove('text-gray-500');

    const activeId = tabType ? `${tabType}-tab-${tabId}` : `tab-${tabId}`;
    const activeContent = document.getElementById(activeId);
    activeContent?.classList.remove('hidden');
  }

  previewDocument(type: string) {

    const activeDoc = document.getElementById('document-preview')
    activeDoc?.classList.remove('hidden');

    const frames = document.querySelectorAll('.doc-frame')
    frames.forEach(content => content.classList.add('hidden'))

    const typeFrame = document.getElementById(type)
    typeFrame?.classList.remove('hidden')
  }

  closePreview() {
    const activeDoc = document.getElementById('document-preview')
    activeDoc?.classList.add('hidden');

    const frames = document.querySelectorAll('.doc-frame')
    frames.forEach(content => content.classList.add('hidden'))
  }
}
