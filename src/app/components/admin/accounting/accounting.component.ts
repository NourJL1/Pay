import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Fees } from '../../../entities/fees';
import { FeesService } from '../../../services/fees.service';
import { FeeSchemaService } from '../../../services/fee-schema.service';
import { FeeSchema } from '../../../entities/fee-schema';
import { FeeRuleTypeService } from '../../../services/fee-rule-type.service';
import { FeeRuleType } from '../../../entities/fee-rule-type';
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
  feeSchemasList: FeeSchema[] = [];
  newFeeSchema: FeeSchema = new FeeSchema();
  selectedFeeSchema: FeeSchema | null = null;
  feeRuleTypesList: FeeRuleType[] = [];
  newFeeRuleType: FeeRuleType = new FeeRuleType();
  selectedFeeRuleType: FeeRuleType | null = null;
  feeRulesList: any[] = [];
  newFeeRule: any = {};
  selectedFeeRule: any | null = null;
  operationTypesList: any[] = [];
  newOperationType: any = {};
  selectedOperationType: any | null = null;
  periodicitiesList: any[] = [];
  newPeriodicity: any = {};
  selectedPeriodicity: any | null = null;
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

  constructor(
    private feesService: FeesService,
    private feeSchemaService: FeeSchemaService,
    private feeRuleTypeService: FeeRuleTypeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit: Initializing component...');
    this.loadFees();
    this.loadFeeSchemas();
    this.loadFeeRuleTypes();
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

  // Load fee schemas from backend
  loadFeeSchemas(): void {
    console.log('loadFeeSchemas: Fetching fee schemas...');
    this.feeSchemaService.getAll().subscribe({
      next: (data) => {
        console.log('loadFeeSchemas: Fee schemas received:', data);
        this.feeSchemasList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('loadFeeSchemas: Error:', err);
        this.showErrorMessage('Failed to load fee schemas.');
      }
    });
  }

  // Load fee rule types from backend
  loadFeeRuleTypes(): void {
    console.log('loadFeeRuleTypes: Fetching fee rule types...');
    this.feeRuleTypeService.getAll().subscribe({
      next: (data) => {
        console.log('loadFeeRuleTypes: Fee rule types received:', data);
        this.feeRuleTypesList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('loadFeeRuleTypes: Error:', err);
        this.showErrorMessage('Failed to load fee rule types.');
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

  // Add a new fee schema
  addFeeSchema(): void {
    console.log('addFeeSchema: Adding fee schema:', this.newFeeSchema);
    this.feeSchemaService.create(this.newFeeSchema, this.getHttpOptions()).subscribe({
      next: (createdFeeSchema) => {
        console.log('addFeeSchema: Fee schema added:', createdFeeSchema);
        this.feeSchemasList.push(createdFeeSchema);
        this.newFeeSchema = new FeeSchema();
        this.isFeeSchemaVisible = false;
        this.showSuccessMessage('Fee schema added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('addFeeSchema: Error:', err);
        this.showErrorMessage('Failed to add fee schema: ' + (err.error?.message || 'Please check the form.'));
      }
    });
  }

  // Edit a fee schema
  editFeeSchema(schema: FeeSchema): void {
    console.log('editFeeSchema: Fee schema object:', schema);
    this.selectedFeeSchema = schema;
    this.newFeeSchema = { ...schema };
    this.isFeeSchemaVisible = true;
    this.cdr.detectChanges();
  }

  // Update a fee schema
  updateFeeSchema(): void {
    console.log('updateFeeSchema: Updating fee schema:', this.newFeeSchema);
    if (this.selectedFeeSchema && this.selectedFeeSchema.fscCode) {
      this.feeSchemaService.update(this.selectedFeeSchema.fscCode, this.newFeeSchema, this.getHttpOptions()).subscribe({
        next: (updatedFeeSchema) => {
          console.log('updateFeeSchema: Fee schema updated:', updatedFeeSchema);
          const index = this.feeSchemasList.findIndex(f => f.fscCode === updatedFeeSchema.fscCode);
          if (index !== -1) {
            this.feeSchemasList[index] = updatedFeeSchema;
            this.feeSchemasList = [...this.feeSchemasList];
          }
          this.newFeeSchema = new FeeSchema();
          this.selectedFeeSchema = null;
          this.isFeeSchemaVisible = false;
          this.showSuccessMessage('Fee schema updated successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('updateFeeSchema: Error:', err);
          this.showErrorMessage('Failed to update fee schema: ' + (err.error?.message || 'Please try again.'));
        }
      });
    } else {
      this.showErrorMessage('No fee schema selected for update.');
    }
  }

  // Delete a fee schema
  deleteFeeSchema(fscCode: number | undefined): void {
    console.log('deleteFeeSchema: fscCode:', fscCode);
    if (fscCode && confirm('Are you sure you want to delete this fee schema?')) {
      this.feeSchemaService.delete(fscCode, this.getHttpOptions()).subscribe({
        next: () => {
          console.log('deleteFeeSchema: Success, fscCode:', fscCode);
          this.feeSchemasList = this.feeSchemasList.filter(f => f.fscCode !== fscCode);
          this.showSuccessMessage('Fee schema deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('deleteFeeSchema: Error:', err);
          this.showErrorMessage('Failed to delete fee schema: ' + (err.error?.message || 'Please try again.'));
        }
      });
    }
  }

  // Add a new fee rule type
  addFeeRuleType(): void {
    console.log('addFeeRuleType: Adding fee rule type:', this.newFeeRuleType);
    this.feeRuleTypeService.create(this.newFeeRuleType, this.getHttpOptions()).subscribe({
      next: (createdFeeRuleType) => {
        console.log('addFeeRuleType: Fee rule type added:', createdFeeRuleType);
        this.feeRuleTypesList.push(createdFeeRuleType);
        this.newFeeRuleType = new FeeRuleType();
        this.isFeeRuleTypeVisible = false;
        this.showSuccessMessage('Fee rule type added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('addFeeRuleType: Error:', err);
        this.showErrorMessage('Failed to add fee rule type: ' + (err.error?.message || 'Please check the form.'));
      }
    });
  }

  // Edit a fee rule type
  editFeeRuleType(type: FeeRuleType): void {
    console.log('editFeeRuleType: Fee rule type object:', type);
    this.selectedFeeRuleType = type;
    this.newFeeRuleType = { ...type };
    this.isFeeRuleTypeVisible = true;
    this.cdr.detectChanges();
  }

  // Update a fee rule type
  updateFeeRuleType(): void {
    console.log('updateFeeRuleType: Updating fee rule type:', this.newFeeRuleType);
    if (this.selectedFeeRuleType && this.selectedFeeRuleType.frtCode) {
      this.feeRuleTypeService.update(this.selectedFeeRuleType.frtCode, this.newFeeRuleType, this.getHttpOptions()).subscribe({
        next: (updatedFeeRuleType) => {
          console.log('updateFeeRuleType: Fee rule type updated:', updatedFeeRuleType);
          const index = this.feeRuleTypesList.findIndex(t => t.frtCode === updatedFeeRuleType.frtCode);
          if (index !== -1) {
            this.feeRuleTypesList[index] = updatedFeeRuleType;
            this.feeRuleTypesList = [...this.feeRuleTypesList];
          }
          this.newFeeRuleType = new FeeRuleType();
          this.selectedFeeRuleType = null;
          this.isFeeRuleTypeVisible = false;
          this.showSuccessMessage('Fee rule type updated successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('updateFeeRuleType: Error:', err);
          this.showErrorMessage('Failed to update fee rule type: ' + (err.error?.message || 'Please try again.'));
        }
      });
    } else {
      this.showErrorMessage('No fee rule type selected for update.');
    }
  }

  // Delete a fee rule type
  deleteFeeRuleType(frtCode: number | undefined): void {
    console.log('deleteFeeRuleType: frtCode:', frtCode);
    if (frtCode && confirm('Are you sure you want to delete this fee rule type?')) {
      this.feeRuleTypeService.delete(frtCode, this.getHttpOptions()).subscribe({
        next: () => {
          console.log('deleteFeeRuleType: Success, frtCode:', frtCode);
          this.feeRuleTypesList = this.feeRuleTypesList.filter(t => t.frtCode !== frtCode);
          this.showSuccessMessage('Fee rule type deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('deleteFeeRuleType: Error:', err);
          this.showErrorMessage('Failed to delete fee rule type: ' + (err.error?.message || 'Please try again.'));
        }
      });
    }
  }

  // Placeholder for Fee Rule methods
  addFeeRule(): void {
    this.isFeeRuleVisible = false;
    this.showSuccessMessage('Fee rule added (placeholder)');
    this.cdr.detectChanges();
  }
  editFeeRule(rule: any): void {
    this.selectedFeeRule = rule;
    this.newFeeRule = { ...rule };
    this.isFeeRuleVisible = true;
    this.cdr.detectChanges();
  }
  updateFeeRule(): void {
    if (this.selectedFeeRule) {
      this.feeRulesList[this.feeRulesList.indexOf(this.selectedFeeRule)] = this.newFeeRule;
      this.isFeeRuleVisible = false;
      this.showSuccessMessage('Fee rule updated (placeholder)');
      this.cdr.detectChanges();
    }
  }
  deleteFeeRule(ruleCode: string | undefined): void {
    if (ruleCode) {
      this.feeRulesList = this.feeRulesList.filter(r => r.ruleCode !== ruleCode);
      this.showSuccessMessage('Fee rule deleted (placeholder)');
      this.cdr.detectChanges();
    }
  }

  // Placeholder for Operation Type methods
  addOperationType(): void {
    this.isOperationTypeVisible = false;
    this.showSuccessMessage('Operation type added (placeholder)');
    this.cdr.detectChanges();
  }
  editOperationType(type: any): void {
    this.selectedOperationType = type;
    this.newOperationType = { ...type };
    this.isOperationTypeVisible = true;
    this.cdr.detectChanges();
  }
  updateOperationType(): void {
    if (this.selectedOperationType) {
      this.operationTypesList[this.operationTypesList.indexOf(this.selectedOperationType)] = this.newOperationType;
      this.isOperationTypeVisible = false;
      this.showSuccessMessage('Operation type updated (placeholder)');
      this.cdr.detectChanges();
    }
  }
  deleteOperationType(typeCode: string | undefined): void {
    if (typeCode) {
      this.operationTypesList = this.operationTypesList.filter(t => t.typeCode !== typeCode);
      this.showSuccessMessage('Operation type deleted (placeholder)');
      this.cdr.detectChanges();
    }
  }

  // Placeholder for Periodicity methods
  addPeriodicity(): void {
    this.isPeriodicityVisible = false;
    this.showSuccessMessage('Periodicity added (placeholder)');
    this.cdr.detectChanges();
  }
  editPeriodicity(periodicity: any): void {
    this.selectedPeriodicity = periodicity;
    this.newPeriodicity = { ...periodicity };
    this.isPeriodicityVisible = true;
    this.cdr.detectChanges();
  }
  updatePeriodicity(): void {
    if (this.selectedPeriodicity) {
      this.periodicitiesList[this.periodicitiesList.indexOf(this.selectedPeriodicity)] = this.newPeriodicity;
      this.isPeriodicityVisible = false;
      this.showSuccessMessage('Periodicity updated (placeholder)');
      this.cdr.detectChanges();
    }
  }
  deletePeriodicity(code: string | undefined): void {
    if (code) {
      this.periodicitiesList = this.periodicitiesList.filter(p => p.code !== code);
      this.showSuccessMessage('Periodicity deleted (placeholder)');
      this.cdr.detectChanges();
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
    if (modal !== 'fee-schema' || !this.selectedFeeSchema) {
      this.newFeeSchema = new FeeSchema();
    }
    if (modal !== 'fee-rule-type' || !this.selectedFeeRuleType) {
      this.newFeeRuleType = new FeeRuleType();
    }
    this.newFee = new Fees();
    this.selectedFee = null;
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
    switch (modal) {
      case 'fee':
        this.newFee = new Fees();
        this.selectedFee = null;
        this.isFeeVisible = false;
        break;
      case 'fee-schema':
        this.newFeeSchema = new FeeSchema();
        this.selectedFeeSchema = null;
        this.isFeeSchemaVisible = false;
        break;
      case 'fee-rule':
        this.newFeeRule = {};
        this.selectedFeeRule = null;
        this.isFeeRuleVisible = false;
        break;
      case 'fee-rule-type':
        this.newFeeRuleType = new FeeRuleType();
        this.selectedFeeRuleType = null;
        this.isFeeRuleTypeVisible = false;
        break;
      case 'operation-type':
        this.newOperationType = {};
        this.selectedOperationType = null;
        this.isOperationTypeVisible = false;
        break;
      case 'operation-mapping':
        this.isOperationMappingVisible = false;
        break;
      case 'operation-periodicity':
        this.newPeriodicity = {};
        this.selectedPeriodicity = null;
        this.isPeriodicityVisible = false;
        break;
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