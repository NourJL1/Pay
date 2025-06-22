import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Fees } from '../../../../entities/fees';
import { FeesService } from '../../../../services/fees.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-accounting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounting.component.html',
  styleUrl: './accounting.component.css'
})
export class AccountingComponent implements OnInit {
  feesList: Fees[] = [];
  newFee: Fees = new Fees();
  selectedFee: Fees | null = null;
  feeSchemasList: any[] = []; // Placeholder, replace with FeeSchema type
  newFeeSchema: any = {}; // Placeholder, replace with FeeSchema type
  selectedFeeSchema: any | null = null; // Placeholder, replace with FeeSchema type
  feeRuleTypesList: any[] = []; // Placeholder
  newFeeRuleType: any = {}; // Placeholder
  selectedFeeRuleType: any | null = null; // Placeholder
  feeRulesList: any[] = []; // Placeholder
  newFeeRule: any = {}; // Placeholder
  selectedFeeRule: any | null = null; // Placeholder
  operationTypesList: any[] = []; // Placeholder
  newOperationType: any = {}; // Placeholder
  selectedOperationType: any | null = null; // Placeholder
  periodicitiesList: any[] = []; // Placeholder
  newPeriodicity: any = {}; // Placeholder
  selectedPeriodicity: any | null = null; // Placeholder
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Modals
  isFeeVisible: boolean = false;
  isFeeSchemaVisible: boolean = false;
  isFeeRuleVisible: boolean = false;
  isFeeRuleTypeVisible: boolean = false;
  isOperationTypeVisible: boolean = false;
  isOperationMappingVisible: boolean = false;
  isPeriodicityVisible: boolean = false;

  constructor(private feesService: FeesService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('ngOnInit: Initializing component...');
    this.loadFees();
  }

  // Get HTTP headers with X-Roles for authenticated requests
  private getHttpOptions(): { headers: HttpHeaders } {
    const role = localStorage.getItem('role') || 'ROLE_ADMIN';
    console.log('getHttpOptions: Role:', role);
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Roles': role
      })
    };
  }

  // Load fees from backend
  loadFees(): void {
    console.log('loadFees: Fetching fees...');
    this.feesService.getAll().subscribe({
      next: (data) => {
        console.log('loadFees: Fees received:', data);
        this.feesList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('loadFees: Error:', err);
        this.showErrorMessage('Failed to load fees.');
      }
    });
  }

  // Add a new fee
  addFee(): void {
    console.log('addFee: Adding fee:', this.newFee);
    this.feesService.create(this.newFee, this.getHttpOptions()).subscribe({
      next: (createdFee) => {
        console.log('addFee: Fee added:', createdFee);
        this.feesList.push(createdFee);
        this.newFee = new Fees();
        this.isFeeVisible = false;
        this.showSuccessMessage('Fee added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('addFee: Error:', err);
        this.showErrorMessage('Failed to add fee: ' + (err.error?.message || 'Please check the form.'));
      }
    });
  }

  // Edit a fee
  editFee(fee: Fees): void {
    console.log('editFee: Fee object:', fee);
    this.selectedFee = fee;
    this.newFee = { ...fee };
    this.isFeeVisible = true;
    this.cdr.detectChanges();
  }

  // Update a fee
  updateFee(): void {
    console.log('updateFee: Updating fee:', this.newFee);
    if (this.selectedFee && this.selectedFee.feeCode) {
      this.feesService.update(this.selectedFee.feeCode, this.newFee, this.getHttpOptions()).subscribe({
        next: (updatedFee) => {
          console.log('updateFee: Fee updated:', updatedFee);
          const index = this.feesList.findIndex(f => f.feeCode === updatedFee.feeCode);
          if (index !== -1) {
            this.feesList[index] = updatedFee;
            this.feesList = [...this.feesList];
          }
          this.newFee = new Fees();
          this.selectedFee = null;
          this.isFeeVisible = false;
          this.showSuccessMessage('Fee updated successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('updateFee: Error:', err);
          this.showErrorMessage('Failed to update fee: ' + (err.error?.message || 'Please try again.'));
        }
      });
    } else {
      this.showErrorMessage('No fee selected for update.');
    }
  }

  // Delete a fee
  deleteFee(feeCode: number | undefined): void {
    console.log('deleteFee: feeCode:', feeCode);
    if (feeCode && confirm('Are you sure you want to delete this fee?')) {
      this.feesService.delete(feeCode, this.getHttpOptions()).subscribe({
        next: () => {
          console.log('deleteFee: Success, feeCode:', feeCode);
          this.feesList = this.feesList.filter(f => f.feeCode !== feeCode);
          this.showSuccessMessage('Fee deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('deleteFee: Error:', err);
          this.showErrorMessage('Failed to delete fee: ' + (err.error?.message || 'Please try again.'));
        }
      });
    }
  }

  // Placeholder for Fee Schema methods (to be implemented with FeeSchemaService)
  addFeeSchema(): void {
    console.log('addFeeSchema: Adding fee schema:', this.newFeeSchema);
    // Implement with FeeSchemaService
    this.isFeeSchemaVisible = false;
    this.showSuccessMessage('Fee schema added successfully (placeholder)');
    this.cdr.detectChanges();
  }

  editFeeSchema(schema: any): void {
    console.log('editFeeSchema: Fee schema object:', schema);
    this.selectedFeeSchema = schema;
    this.newFeeSchema = { ...schema };
    this.isFeeSchemaVisible = true;
    this.cdr.detectChanges();
  }

  updateFeeSchema(): void {
    console.log('updateFeeSchema: Updating fee schema:', this.newFeeSchema);
    if (this.selectedFeeSchema && this.selectedFeeSchema.fscCode) {
      // Implement with FeeSchemaService
      const index = this.feeSchemasList.findIndex(f => f.fscCode === this.selectedFeeSchema.fscCode);
      if (index !== -1) {
        this.feeSchemasList[index] = this.newFeeSchema;
        this.feeSchemasList = [...this.feeSchemasList];
      }
      this.newFeeSchema = {};
      this.selectedFeeSchema = null;
      this.isFeeSchemaVisible = false;
      this.showSuccessMessage('Fee schema updated successfully (placeholder)');
      this.cdr.detectChanges();
    } else {
      this.showErrorMessage('No fee schema selected for update.');
    }
  }

  deleteFeeSchema(fscCode: number | undefined): void {
    console.log('deleteFeeSchema: fscCode:', fscCode);
    if (fscCode && confirm('Are you sure you want to delete this fee schema?')) {
      // Implement with FeeSchemaService
      this.feeSchemasList = this.feeSchemasList.filter(f => f.fscCode !== fscCode);
      this.showSuccessMessage('Fee schema deleted successfully (placeholder)');
      this.cdr.detectChanges();
    }
  }

  // Placeholder for Fee Rule Type methods
  addFeeRuleType(): void { this.isFeeRuleTypeVisible = false; this.showSuccessMessage('Fee rule type added (placeholder)'); this.cdr.detectChanges(); }
  editFeeRuleType(type: any): void { this.selectedFeeRuleType = type; this.newFeeRuleType = { ...type }; this.isFeeRuleTypeVisible = true; this.cdr.detectChanges(); }
  updateFeeRuleType(): void { if (this.selectedFeeRuleType) { this.feeRuleTypesList[this.feeRuleTypesList.indexOf(this.selectedFeeRuleType)] = this.newFeeRuleType; this.isFeeRuleTypeVisible = false; this.showSuccessMessage('Fee rule type updated (placeholder)'); this.cdr.detectChanges(); } }
  deleteFeeRuleType(typeCode: string | undefined): void { if (typeCode) { this.feeRuleTypesList = this.feeRuleTypesList.filter(t => t.typeCode !== typeCode); this.showSuccessMessage('Fee rule type deleted (placeholder)'); this.cdr.detectChanges(); } }

  // Placeholder for Fee Rule methods
  addFeeRule(): void { this.isFeeRuleVisible = false; this.showSuccessMessage('Fee rule added (placeholder)'); this.cdr.detectChanges(); }
  editFeeRule(rule: any): void { this.selectedFeeRule = rule; this.newFeeRule = { ...rule }; this.isFeeRuleVisible = true; this.cdr.detectChanges(); }
  updateFeeRule(): void { if (this.selectedFeeRule) { this.feeRulesList[this.feeRulesList.indexOf(this.selectedFeeRule)] = this.newFeeRule; this.isFeeRuleVisible = false; this.showSuccessMessage('Fee rule updated (placeholder)'); this.cdr.detectChanges(); } }
  deleteFeeRule(ruleCode: string | undefined): void { if (ruleCode) { this.feeRulesList = this.feeRulesList.filter(r => r.ruleCode !== ruleCode); this.showSuccessMessage('Fee rule deleted (placeholder)'); this.cdr.detectChanges(); } }

  // Placeholder for Operation Type methods
  addOperationType(): void { this.isOperationTypeVisible = false; this.showSuccessMessage('Operation type added (placeholder)'); this.cdr.detectChanges(); }
  editOperationType(type: any): void { this.selectedOperationType = type; this.newOperationType = { ...type }; this.isOperationTypeVisible = true; this.cdr.detectChanges(); }
  updateOperationType(): void { if (this.selectedOperationType) { this.operationTypesList[this.operationTypesList.indexOf(this.selectedOperationType)] = this.newOperationType; this.isOperationTypeVisible = false; this.showSuccessMessage('Operation type updated (placeholder)'); this.cdr.detectChanges(); } }
  deleteOperationType(typeCode: string | undefined): void { if (typeCode) { this.operationTypesList = this.operationTypesList.filter(t => t.typeCode !== typeCode); this.showSuccessMessage('Operation type deleted (placeholder)'); this.cdr.detectChanges(); } }

  // Placeholder for Periodicity methods
  addPeriodicity(): void { this.isPeriodicityVisible = false; this.showSuccessMessage('Periodicity added (placeholder)'); this.cdr.detectChanges(); }
  editPeriodicity(periodicity: any): void { this.selectedPeriodicity = periodicity; this.newPeriodicity = { ...periodicity }; this.isPeriodicityVisible = true; this.cdr.detectChanges(); }
  updatePeriodicity(): void { if (this.selectedPeriodicity) { this.periodicitiesList[this.periodicitiesList.indexOf(this.selectedPeriodicity)] = this.newPeriodicity; this.isPeriodicityVisible = false; this.showSuccessMessage('Periodicity updated (placeholder)'); this.cdr.detectChanges(); } }
  deletePeriodicity(code: string | undefined): void { if (code) { this.periodicitiesList = this.periodicitiesList.filter(p => p.code !== code); this.showSuccessMessage('Periodicity deleted (placeholder)'); this.cdr.detectChanges(); } }

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

  // Clear messages
  clearMessage(): void {
    console.log('clearMessage: Clearing messages');
    this.successMessage = null;
    this.errorMessage = null;
    this.cdr.detectChanges();
  }

  // Open a form
  toggleForm(modal: string): void {
    console.log('toggleForm: Opening modal:', modal);
    this.newFee = new Fees();
    this.selectedFee = null;
    this.newFeeSchema = {};
    this.selectedFeeSchema = null;
    this.newFeeRuleType = {};
    this.selectedFeeRuleType = null;
    this.newFeeRule = {};
    this.selectedFeeRule = null;
    this.newOperationType = {};
    this.selectedOperationType = null;
    this.newPeriodicity = {};
    this.selectedPeriodicity = null;
    switch (modal) {
      case 'fee': this.isFeeVisible = true; break;
      case 'fee-schema': this.isFeeSchemaVisible = true; break;
      case 'fee-rule': this.isFeeRuleVisible = true; break;
      case 'fee-rule-type': this.isFeeRuleTypeVisible = true; break;
      case 'operation-type': this.isOperationTypeVisible = true; break;
      case 'operation-mapping': this.isOperationMappingVisible = true; break;
      case 'operation-periodicity': this.isPeriodicityVisible = true; break;
    }
    this.cdr.detectChanges();
  }

  // Close a form
  closeForm(modal: string): void {
    console.log('closeForm: Closing modal:', modal);
    this.newFee = new Fees();
    this.selectedFee = null;
    this.newFeeSchema = {};
    this.selectedFeeSchema = null;
    this.newFeeRuleType = {};
    this.selectedFeeRuleType = null;
    this.newFeeRule = {};
    this.selectedFeeRule = null;
    this.newOperationType = {};
    this.selectedOperationType = null;
    this.newPeriodicity = {};
    this.selectedPeriodicity = null;
    switch (modal) {
      case 'fee': this.isFeeVisible = false; break;
      case 'fee-schema': this.isFeeSchemaVisible = false; break;
      case 'fee-rule': this.isFeeRuleVisible = false; break;
      case 'fee-rule-type': this.isFeeRuleTypeVisible = false; break;
      case 'operation-type': this.isOperationTypeVisible = false; break;
      case 'operation-mapping': this.isOperationMappingVisible = false; break;
      case 'operation-periodicity': this.isPeriodicityVisible = false; break;
    }
    this.cdr.detectChanges();
  }

  get isAnyModalVisible(): boolean {
    return (
      this.isFeeVisible ||
      this.isFeeSchemaVisible ||
      this.isFeeRuleVisible ||
      this.isFeeRuleTypeVisible ||
      this.isOperationTypeVisible ||
      this.isOperationMappingVisible ||
      this.isPeriodicityVisible
    );
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
}