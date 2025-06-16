
import { OperationType } from './operation-type';
import { Wallet } from './wallet';
import { Periodicity } from './periodicity';
import { Fees } from './fees';



export class WalletOperationTypeMap {

    wotmCode?: number;
  operationType!: OperationType;
  wallet!: Wallet;
  wotmLimitMax?: number;
  wotmDispAmount?: number;
  wotmFeeIden?: number;
  wotmFeeLab?: string;
  wotmFeeMinLimit?: number;
  wotmFeeAmount?: number;
  wotmFeeMaxLimit?: number;
  wotmFeePercentage?: string;
  wotmFinId?: number;
  periodicity!: Periodicity;
  fees!: Fees;

  constructor(init?: Partial<WalletOperationTypeMap>) {
    Object.assign(this, init);
  }
}
