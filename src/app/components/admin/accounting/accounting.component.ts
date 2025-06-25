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
import { OperationTypeService } from '../../../services/operation-type.service';
import { OperationType } from '../../../entities/operation-type';
import { PeriodicityService } from '../../../services/periodicity.service';
import { Periodicity } from '../../../entities/periodicity';
import { FeeRuleService } from '../../../services/fee-rule.service';
import { FeeRule } from '../../../entities/fee-rule';
import { VatRateService } from '../../../services/vat-rate.service';
import { VatRate } from '../../../entities/vat-rate';

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
  feeRulesList: FeeRule[] = [];
  newFeeRule: FeeRule = new FeeRule({
    fruIden: '',
    fruLabe: '',
    fruPrimaryWalletId: '',
    fruPrimaryAmount: 0,
    fruPrimaryFeesId: 0,
    fruFeesWalletId: '',
    fruFeesAmount: 0,
    fruTva: new VatRate({ vatCode: 0, vatLabe: '', vatRate: 0 }),
    fruTvaWalletId: '',
    fruTvaAmount: 0,
    fruSens: '',
    feeRuleType: new FeeRuleType({ frtCode: 0, frtLabe: '' }),
    feeSchema: new FeeSchema({ fscCode: 0, fscLabe: '' })
  });
  selectedFeeRule: FeeRule | null = null;
  operationTypesList: OperationType[] = [];
  newOperationType: OperationType = new OperationType({ feeSchema: new FeeSchema() });
  selectedOperationType: OperationType | null = null;
  periodicitiesList: Periodicity[] = [];
  newPeriodicity: Periodicity = new Periodicity();
  selectedPeriodicity: Periodicity | null = null;
  vatRatesList: VatRate[] = [];
  wallets: { id: string, label: string }[] = [];
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
    private operationTypeService: OperationTypeService,
    private periodicityService: PeriodicityService,
    private feeRuleService: FeeRuleService,
    private vatRateService: VatRateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit: Initializing component...');
    this.loadFees();
    this.loadFeeSchemas();
    this.loadFeeRuleTypes();
    this.loadOperationTypes();
    this.loadPeriodicities();
    this.loadFeeRules();
    this.loadVatRates();
    this.loadWallets();
  }

  private getHttpOptions(): { headers: HttpHeaders } {
    const role = localStorage.getItem('role') || 'ROLE_ADMIN';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Roles': role
      })
    };
  }

  loadFees(): void {
    this.feesService.getAll().subscribe({
      next: (data) => {
        this.feesList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showErrorMessage('Failed to load fees.');
      }
    });
  }

  loadFeeSchemas(): void {
    this.feeSchemaService.getAll().subscribe({
      next: (data) => {
        this.feeSchemasList = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showErrorMessage('Failed to load fee schemas.');
      }
    });
  }

  loadFeeRuleTypes(): void {
    this.feeRuleTypeService.getAll().subscribe({
      next: (data) => {
        this.feeRuleTypesList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showErrorMessage('Failed to load fee rule types.');
      }
    });
  }

  loadOperationTypes(): void {
    this.operationTypeService.getAll().subscribe({
      next: (data) => {
        this.operationTypesList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showErrorMessage('Failed to load operation types.');
      }
    });
  }

  loadPeriodicities(): void {
    this.periodicityService.getAll().subscribe({
      next: (data) => {
        this.periodicitiesList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showErrorMessage('Failed to load periodicities.');
      }
    });
  }

  loadFeeRules(): void {
    this.feeRuleService.getAll().subscribe({
      next: (data) => {
        this.feeRulesList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showErrorMessage('Failed to load fee rules.');
      }
    });
  }

  loadVatRates(): void {
    this.vatRateService.getAll().subscribe({
      next: (data) => {
        this.vatRatesList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showErrorMessage('Failed to load VAT rates.');
      }
    });
  }

  loadWallets(): void {
    this.wallets = [
      { id: 'WAL-001', label: 'Wallet 001' },
      { id: 'WAL-002', label: 'Wallet 002' },
      { id: 'WAL-003', label: 'Wallet 003' }
    ];
    this.cdr.detectChanges();
  }

  addFee(): void {
    this.feesService.create(this.newFee, this.getHttpOptions()).subscribe({
      next: (createdFee) => {
        this.feesList.push(createdFee);
        this.newFee = new Fees();
        this.isFeeVisible = false;
        this.showSuccessMessage('Fee added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showErrorMessage('Failed to add fee.');
      }
    });
  }

  editFee(fee: Fees): void {
    this.selectedFee = fee;
    this.newFee = { ...fee };
    this.isFeeVisible = true;
    this.cdr.detectChanges();
  }

  updateFee(): void {
    if (this.selectedFee && this.selectedFee.feeCode) {
      this.feesService.update(this.selectedFee.feeCode, this.newFee, this.getHttpOptions()).subscribe({
        next: (updatedFee) => {
          const index = this.feesList.findIndex(f => f.feeCode === updatedFee.feeCode);
          if (index !== -1) this.feesList[index] = updatedFee;
          this.newFee = new Fees();
          this.selectedFee = null;
          this.isFeeVisible = false;
          this.showSuccessMessage('Fee updated successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.showErrorMessage('Failed to update fee.');
        }
      });
    }
  }

  deleteFee(feeCode: number | undefined): void {
    if (feeCode && confirm('Are you sure you want to delete this fee?')) {
      this.feesService.delete(feeCode, this.getHttpOptions()).subscribe({
        next: () => {
          this.feesList = this.feesList.filter(f => f.feeCode !== feeCode);
          this.showSuccessMessage('Fee deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.showErrorMessage('Failed to delete fee.');
        }
      });
    }
  }

  addFeeSchema(): void {
    this.feeSchemaService.create(this.newFeeSchema, this.getHttpOptions()).subscribe({
      next: (createdFeeSchema) => {
        this.feeSchemasList.push(createdFeeSchema);
        this.newFeeSchema = new FeeSchema();
        this.isFeeSchemaVisible = false;
        this.showSuccessMessage('Fee schema added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showErrorMessage('Failed to add fee schema.');
      }
    });
  }

  editFeeSchema(schema: FeeSchema): void {
    this.selectedFeeSchema = schema;
    this.newFeeSchema = { ...schema };
    this.isFeeSchemaVisible = true;
    this.cdr.detectChanges();
  }

  updateFeeSchema(): void {
    if (this.selectedFeeSchema && this.selectedFeeSchema.fscCode) {
      this.feeSchemaService.update(this.selectedFeeSchema.fscCode, this.newFeeSchema, this.getHttpOptions()).subscribe({
        next: (updatedFeeSchema) => {
          const index = this.feeSchemasList.findIndex(f => f.fscCode === updatedFeeSchema.fscCode);
          if (index !== -1) this.feeSchemasList[index] = updatedFeeSchema;
          this.newFeeSchema = new FeeSchema();
          this.selectedFeeSchema = null;
          this.isFeeSchemaVisible = false;
          this.showSuccessMessage('Fee schema updated successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.showErrorMessage('Failed to update fee schema.');
        }
      });
    }
  }

  deleteFeeSchema(fscCode: number | undefined): void {
    if (fscCode && confirm('Are you sure you want to delete this fee schema?')) {
      this.feeSchemaService.delete(fscCode, this.getHttpOptions()).subscribe({
        next: () => {
          this.feeSchemasList = this.feeSchemasList.filter(f => f.fscCode !== fscCode);
          this.showSuccessMessage('Fee schema deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.showErrorMessage('Failed to delete fee schema.');
        }
      });
    }
  }

  addFeeRuleType(): void {
    this.feeRuleTypeService.create(this.newFeeRuleType, this.getHttpOptions()).subscribe({
      next: (createdFeeRuleType) => {
        this.feeRuleTypesList.push(createdFeeRuleType);
        this.newFeeRuleType = new FeeRuleType();
        this.isFeeRuleTypeVisible = false;
        this.showSuccessMessage('Fee rule type added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showErrorMessage('Failed to add fee rule type.');
      }
    });
  }

  editFeeRuleType(type: FeeRuleType): void {
    this.selectedFeeRuleType = type;
    this.newFeeRuleType = { ...type };
    this.isFeeRuleTypeVisible = true;
    this.cdr.detectChanges();
  }

  updateFeeRuleType(): void {
    if (this.selectedFeeRuleType && this.selectedFeeRuleType.frtCode) {
      this.feeRuleTypeService.update(this.selectedFeeRuleType.frtCode, this.newFeeRuleType, this.getHttpOptions()).subscribe({
        next: (updatedFeeRuleType) => {
          const index = this.feeRuleTypesList.findIndex(t => t.frtCode === updatedFeeRuleType.frtCode);
          if (index !== -1) this.feeRuleTypesList[index] = updatedFeeRuleType;
          this.newFeeRuleType = new FeeRuleType();
          this.selectedFeeRuleType = null;
          this.isFeeRuleTypeVisible = false;
          this.showSuccessMessage('Fee rule type updated successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.showErrorMessage('Failed to update fee rule type.');
        }
      });
    }
  }

  deleteFeeRuleType(frtCode: number | undefined): void {
    if (frtCode && confirm('Are you sure you want to delete this fee rule type?')) {
      this.feeRuleTypeService.delete(frtCode, this.getHttpOptions()).subscribe({
        next: () => {
          this.feeRuleTypesList = this.feeRuleTypesList.filter(t => t.frtCode !== frtCode);
          this.showSuccessMessage('Fee rule type deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.showErrorMessage('Failed to delete fee rule type.');
        }
      });
    }
  }

  addOperationType(): void {
    if (!this.newOperationType.optIden || !this.newOperationType.optLabe || !this.newOperationType.feeSchema?.fscCode) {
      this.showErrorMessage('Please fill in all required fields.');
      return;
    }
    this.operationTypeService.create(this.newOperationType, this.getHttpOptions()).subscribe({
      next: (createdOperationType) => {
        this.operationTypesList = [...this.operationTypesList, createdOperationType];
        this.newOperationType = new OperationType({ feeSchema: new FeeSchema() });
        this.isOperationTypeVisible = false;
        this.showSuccessMessage('Operation type added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showErrorMessage('Failed to add operation type.');
      }
    });
  }

  editOperationType(type: OperationType): void {
    this.selectedOperationType = type;
    this.newOperationType = { ...type, feeSchema: { ...type.feeSchema } };
    this.isOperationTypeVisible = true;
    this.cdr.detectChanges();
  }

  updateOperationType(): void {
    if (!this.newOperationType.optIden || !this.newOperationType.optLabe || !this.newOperationType.feeSchema?.fscCode) {
      this.showErrorMessage('Please fill in all required fields.');
      return;
    }
    if (this.selectedOperationType && this.selectedOperationType.optCode) {
      this.operationTypeService.update(this.selectedOperationType.optCode, this.newOperationType, this.getHttpOptions()).subscribe({
        next: (updatedOperationType) => {
          const index = this.operationTypesList.findIndex(t => t.optCode === updatedOperationType.optCode);
          if (index !== -1) this.operationTypesList[index] = updatedOperationType;
          this.newOperationType = new OperationType({ feeSchema: new FeeSchema() });
          this.selectedOperationType = null;
          this.isOperationTypeVisible = false;
          this.showSuccessMessage('Operation type updated successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.showErrorMessage('Failed to update operation type.');
        }
      });
    }
  }

  deleteOperationType(typeCode: number | undefined): void {
    if (typeCode && confirm('Are you sure you want to delete this operation type?')) {
      this.operationTypeService.delete(typeCode, this.getHttpOptions()).subscribe({
        next: () => {
          this.operationTypesList = this.operationTypesList.filter(t => t.optCode !== typeCode);
          this.showSuccessMessage('Operation type deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.showErrorMessage('Failed to delete operation type.');
        }
      });
    }
  }

  addPeriodicity(): void {
    if (!this.newPeriodicity.perIden || !this.newPeriodicity.perLabe) {
      this.showErrorMessage('Please fill in all required fields.');
      return;
    }
    this.periodicityService.create(this.newPeriodicity, this.getHttpOptions()).subscribe({
      next: (createdPeriodicity) => {
        this.periodicitiesList = [...this.periodicitiesList, createdPeriodicity];
        this.newPeriodicity = new Periodicity();
        this.isPeriodicityVisible = false;
        this.showSuccessMessage('Periodicity added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showErrorMessage('Failed to add periodicity.');
      }
    });
  }

  editPeriodicity(periodicity: Periodicity): void {
    this.selectedPeriodicity = periodicity;
    this.newPeriodicity = new Periodicity({ ...periodicity });
    this.isPeriodicityVisible = true;
    this.cdr.detectChanges();
  }

  updatePeriodicity(): void {
    if (!this.newPeriodicity.perIden || !this.newPeriodicity.perLabe) {
      this.showErrorMessage('Please fill in all required fields.');
      return;
    }
    if (this.selectedPeriodicity && this.selectedPeriodicity.perCode) {
      this.periodicityService.update(this.selectedPeriodicity.perCode, this.newPeriodicity, this.getHttpOptions()).subscribe({
        next: (updatedPeriodicity) => {
          const index = this.periodicitiesList.findIndex(p => p.perCode === updatedPeriodicity.perCode);
          if (index !== -1) this.periodicitiesList[index] = updatedPeriodicity;
          this.newPeriodicity = new Periodicity();
          this.selectedPeriodicity = null;
          this.isPeriodicityVisible = false;
          this.showSuccessMessage('Periodicity updated successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.showErrorMessage('Failed to update periodicity.');
        }
      });
    }
  }

  deletePeriodicity(perCode: number | undefined): void {
    if (perCode && confirm('Are you sure you want to delete this periodicity?')) {
      this.periodicityService.delete(perCode, this.getHttpOptions()).subscribe({
        next: () => {
          this.periodicitiesList = this.periodicitiesList.filter(p => p.perCode !== perCode);
          this.showSuccessMessage('Periodicity deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.showErrorMessage('Failed to delete periodicity.');
        }
      });
    }
  }

  addFeeRule(): void {
    if (!this.newFeeRule.fruIden || !this.newFeeRule.fruLabe || !this.newFeeRule.fruPrimaryWalletId ||
        !this.newFeeRule.fruPrimaryAmount || !this.newFeeRule.fruPrimaryFeesId || !this.newFeeRule.fruFeesWalletId ||
        !this.newFeeRule.fruFeesAmount || !this.newFeeRule.fruTva.vatCode || !this.newFeeRule.fruTvaWalletId ||
        !this.newFeeRule.fruTvaAmount || !this.newFeeRule.fruSens || !this.newFeeRule.feeRuleType.frtCode ||
        !this.newFeeRule.feeSchema.fscCode) {
      this.showErrorMessage('Please fill in all required fields.');
      return;
    }
    this.feeRuleService.create(this.newFeeRule, this.getHttpOptions()).subscribe({
      next: (createdFeeRule) => {
        this.feeRulesList = [...this.feeRulesList, createdFeeRule];
        this.newFeeRule = new FeeRule({
          fruIden: '',
          fruLabe: '',
          fruPrimaryWalletId: '',
          fruPrimaryAmount: 0,
          fruPrimaryFeesId: 0,
          fruFeesWalletId: '',
          fruFeesAmount: 0,
          fruTva: new VatRate({ vatCode: 0, vatLabe: '', vatRate: 0 }),
          fruTvaWalletId: '',
          fruTvaAmount: 0,
          fruSens: '',
          feeRuleType: new FeeRuleType({ frtCode: 0, frtLabe: '' }),
          feeSchema: new FeeSchema({ fscCode: 0, fscLabe: '' })
        });
        this.isFeeRuleVisible = false;
        this.showSuccessMessage('Fee rule added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showErrorMessage('Failed to add fee rule.');
      }
    });
  }

  editFeeRule(rule: FeeRule): void {
    this.selectedFeeRule = rule;
    this.newFeeRule = new FeeRule({
      fruCode: rule.fruCode || 0,
      fruIden: rule.fruIden || '',
      fruLabe: rule.fruLabe || '',
      fruPrimaryWalletId: rule.fruPrimaryWalletId || '',
      fruPrimaryAmount: rule.fruPrimaryAmount || 0,
      fruPrimaryFeesId: rule.fruPrimaryFeesId || 0,
      fruFeesWalletId: rule.fruFeesWalletId || '',
      fruFeesAmount: rule.fruFeesAmount || 0,
      fruTva: new VatRate(rule.fruTva || { vatCode: 0, vatLabe: '', vatRate: 0 }),
      fruTvaWalletId: rule.fruTvaWalletId || '',
      fruTvaAmount: rule.fruTvaAmount || 0,
      fruSens: rule.fruSens || '',
      feeRuleType: new FeeRuleType(rule.feeRuleType || { frtCode: 0, frtLabe: '' }),
      feeSchema: new FeeSchema(rule.feeSchema || { fscCode: 0, fscLabe: '' })
    });
    this.isFeeRuleVisible = true;
    this.cdr.detectChanges();
  }

  updateFeeRule(): void {
    if (!this.newFeeRule.fruIden || !this.newFeeRule.fruLabe || !this.newFeeRule.fruPrimaryWalletId ||
        !this.newFeeRule.fruPrimaryAmount || !this.newFeeRule.fruPrimaryFeesId || !this.newFeeRule.fruFeesWalletId ||
        !this.newFeeRule.fruFeesAmount || !this.newFeeRule.fruTva.vatCode || !this.newFeeRule.fruTvaWalletId ||
        !this.newFeeRule.fruTvaAmount || !this.newFeeRule.fruSens || !this.newFeeRule.feeRuleType.frtCode ||
        !this.newFeeRule.feeSchema.fscCode) {
      this.showErrorMessage('Please fill in all required fields.');
      return;
    }
    if (this.selectedFeeRule && this.selectedFeeRule.fruCode) {
      this.feeRuleService.update(this.selectedFeeRule.fruCode, this.newFeeRule, this.getHttpOptions()).subscribe({
        next: (updatedFeeRule) => {
          const index = this.feeRulesList.findIndex(r => r.fruCode === updatedFeeRule.fruCode);
          if (index !== -1) this.feeRulesList[index] = updatedFeeRule;
          this.newFeeRule = new FeeRule({
            fruIden: '',
            fruLabe: '',
            fruPrimaryWalletId: '',
            fruPrimaryAmount: 0,
            fruPrimaryFeesId: 0,
            fruFeesWalletId: '',
            fruFeesAmount: 0,
            fruTva: new VatRate({ vatCode: 0, vatLabe: '', vatRate: 0 }),
            fruTvaWalletId: '',
            fruTvaAmount: 0,
            fruSens: '',
            feeRuleType: new FeeRuleType({ frtCode: 0, frtLabe: '' }),
            feeSchema: new FeeSchema({ fscCode: 0, fscLabe: '' })
          });
          this.selectedFeeRule = null;
          this.isFeeRuleVisible = false;
          this.showSuccessMessage('Fee rule updated successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.showErrorMessage('Failed to update fee rule.');
        }
      });
    }
  }

  deleteFeeRule(ruleCode: number | undefined): void {
    if (ruleCode && confirm('Are you sure you want to delete this fee rule?')) {
      this.feeRuleService.delete(ruleCode, this.getHttpOptions()).subscribe({
        next: () => {
          this.feeRulesList = this.feeRulesList.filter(r => r.fruCode !== ruleCode);
          this.showSuccessMessage('Fee rule deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.showErrorMessage('Failed to delete fee rule.');
        }
      });
    }
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.errorMessage = null;
    setTimeout(() => {
      this.clearMessage();
    }, 3000);
  }

  showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.successMessage = null;
    setTimeout(() => {
      this.clearMessage();
    }, 3000);
  }

  clearMessage(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.cdr.detectChanges();
  }

  toggleForm(modal: string): void {
    if (modal === 'fee') {
      this.newFee = new Fees();
      this.selectedFee = null;
      this.isFeeVisible = true;
    } else if (modal === 'fee-schema') {
      this.newFeeSchema = new FeeSchema();
      this.selectedFeeSchema = null;
      this.isFeeSchemaVisible = true;
    } else if (modal === 'fee-rule-type') {
      this.newFeeRuleType = new FeeRuleType();
      this.selectedFeeRuleType = null;
      this.isFeeRuleTypeVisible = true;
    } else if (modal === 'fee-rule') {
      this.newFeeRule = new FeeRule({
        fruIden: '',
        fruLabe: '',
        fruPrimaryWalletId: '',
        fruPrimaryAmount: 0,
        fruPrimaryFeesId: 0,
        fruFeesWalletId: '',
        fruFeesAmount: 0,
        fruTva: new VatRate({ vatCode: 0, vatLabe: '', vatRate: 0 }),
        fruTvaWalletId: '',
        fruTvaAmount: 0,
        fruSens: '',
        feeRuleType: new FeeRuleType({ frtCode: 0, frtLabe: '' }),
        feeSchema: new FeeSchema({ fscCode: 0, fscLabe: '' })
      });
      this.selectedFeeRule = null;
      this.isFeeRuleVisible = true;
    } else if (modal === 'operation-type') {
      this.newOperationType = new OperationType({ feeSchema: new FeeSchema() });
      this.selectedOperationType = null;
      this.isOperationTypeVisible = true;
    } else if (modal === 'operation-periodicity') {
      this.newPeriodicity = new Periodicity();
      this.selectedPeriodicity = null;
      this.isPeriodicityVisible = true;
    }
    this.cdr.detectChanges();
  }

  closeForm(modal: string): void {
    if (modal === 'fee') {
      this.newFee = new Fees();
      this.selectedFee = null;
      this.isFeeVisible = false;
    } else if (modal === 'fee-schema') {
      this.newFeeSchema = new FeeSchema();
      this.selectedFeeSchema = null;
      this.isFeeSchemaVisible = false;
    } else if (modal === 'fee-rule-type') {
      this.newFeeRuleType = new FeeRuleType();
      this.selectedFeeRuleType = null;
      this.isFeeRuleTypeVisible = false;
    } else if (modal === 'fee-rule') {
      this.newFeeRule = new FeeRule({
        fruIden: '',
        fruLabe: '',
        fruPrimaryWalletId: '',
        fruPrimaryAmount: 0,
        fruPrimaryFeesId: 0,
        fruFeesWalletId: '',
        fruFeesAmount: 0,
        fruTva: new VatRate({ vatCode: 0, vatLabe: '', vatRate: 0 }),
        fruTvaWalletId: '',
        fruTvaAmount: 0,
        fruSens: '',
        feeRuleType: new FeeRuleType({ frtCode: 0, frtLabe: '' }),
        feeSchema: new FeeSchema({ fscCode: 0, fscLabe: '' })
      });
      this.selectedFeeRule = null;
      this.isFeeRuleVisible = false;
    } else if (modal === 'operation-type') {
      this.newOperationType = new OperationType({ feeSchema: new FeeSchema() });
      this.selectedOperationType = null;
      this.isOperationTypeVisible = false;
    } else if (modal === 'operation-periodicity') {
      this.newPeriodicity = new Periodicity();
      this.selectedPeriodicity = null;
      this.isPeriodicityVisible = false;
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
    this.cdr.detectChanges();
  }
}