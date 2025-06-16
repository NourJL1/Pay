
import { OperationType } from './operation-type';
import { WalletCategory } from './wallet-category';
import { Fees } from './fees';
import { Periodicity } from './periodicity';

export class WalletCategoryOperationTypeMap {

     id?: number;

  operationType?: OperationType;

  walletCategory?: WalletCategory;

  limitMax?: number;

  fees?: Fees;

  periodicity?: Periodicity;

  feeIden?: number;

  feeLabel?: string;

  feeMinLimit?: number;

  feeAmount?: number;

  feeMaxLimit?: number;

  feePercentage?: string;

  feeMaxAmount?: number;

  financialInstitutionId?: number;

  constructor(init?: Partial<WalletCategoryOperationTypeMap>) {
    Object.assign(this, init);
  }
}
