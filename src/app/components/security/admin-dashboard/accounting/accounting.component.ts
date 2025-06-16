import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-accounting',
  imports: [CommonModule],
  templateUrl: './accounting.component.html',
  styleUrl: './accounting.component.css'
})
export class AccountingComponent {
  isFeeVisible: boolean = false;
  isFeeSchemaVisible: boolean = false;
  isFeeRuleVisible: boolean = false;
  isFeeRuleTypeVisible: boolean = false;
  isNewOperationTypeVisible: boolean = false;
  isOperationMappingVisible: boolean = false;

  toggleForm(modal: String): void {
    switch (modal) {
      case 'fee': this.isFeeVisible = true; break;
      case 'fee-schema': this.isFeeSchemaVisible = true; break;
      case 'fee-rule': this.isFeeRuleVisible = true; break;
      case 'fee-rule-type': this.isFeeRuleTypeVisible = true; break;
      case 'operation-type': this.isNewOperationTypeVisible = true; break;
      case 'operation-mapping': this.isOperationMappingVisible = true; break;
    }
  }
  closeForm(modal: String): void {
    switch (modal) {
      case 'fee': this.isFeeVisible = false; break;
      case 'fee-schema': this.isFeeSchemaVisible = false; break;
      case 'fee-rule': this.isFeeRuleVisible = false; break;
      case 'fee-rule-type': this.isFeeRuleTypeVisible = false; break;
      case 'operation-type': this.isNewOperationTypeVisible = false; break;
      case 'operation-mapping': this.isOperationMappingVisible = false; break;
    }
  }

  get isAnyModalVisible(): boolean {
    return (
      this.isFeeVisible ||
      this.isFeeSchemaVisible ||
      this.isNewOperationTypeVisible ||
      this.isFeeRuleVisible ||
      this.isFeeRuleTypeVisible ||
      this.isOperationMappingVisible
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



}
