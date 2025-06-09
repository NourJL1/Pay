import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-accounting',
  imports: [CommonModule],
  templateUrl: './accounting.component.html',
  styleUrl: './accounting.component.css'
})
export class AccountingComponent {

    isNewSchemaVisible: boolean = false;
    isNewOperationTypeVisible: boolean = false;
    isNewFeeVisible: boolean = false;
    isNewMappingVisible: boolean = false;
    isNewVatVisible: boolean = false;

  toggleSchemaForm(): void {
    this.isNewSchemaVisible = true;
  }
  closeSchemaForm(): void {
    this.isNewSchemaVisible = false;
  }

   toggleForm(modal: String): void {
    switch (modal)
    {
      case 'schema': this.isNewSchemaVisible = true; break;
      case 'operation': this.isNewOperationTypeVisible = true; break;
      case 'fee': this.isNewFeeVisible = true; break;
      case 'mapping': this.isNewMappingVisible = true; break;
      case 'vat' : this.isNewVatVisible = true; break;
    }
  }
  closeForm(modal: String): void {
    switch (modal)
    {
      case 'schema': this.isNewSchemaVisible = false; break;
      case 'operation': this.isNewOperationTypeVisible = false; break;
      case 'fee': this.isNewFeeVisible = false; break;
      case 'mapping': this.isNewMappingVisible = false; break;
      case 'vat' : this.isNewVatVisible = false; break;
    }
  }

  get isAnyModalVisible(): boolean {
    return (
      this.isNewSchemaVisible ||
      this.isNewOperationTypeVisible ||
      this.isNewFeeVisible ||
      this.isNewMappingVisible ||
      this.isNewVatVisible
    );
  }


  toggleOpertionForm(): void {
    console.log(this.isNewOperationTypeVisible)
    this.isNewOperationTypeVisible = true;
  }
  closeOperationForm(): void {
    this.isNewOperationTypeVisible = false;
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
