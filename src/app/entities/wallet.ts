import { Customer } from './customer';
import { WalletStatus } from './wallet-status';
import { WalletType } from './wallet-type';
import { WalletCategory } from './wallet-category';
import { WalletOperations } from './wallet-operations';
import { WalletBalanceHistory } from './wallet-balance-history';
import { OperationType } from './operation-type';
import { CardList } from './card-list';
import { AccountList } from './account-list';
import { WalletOperationTypeMap } from './wallet-operation-type-map';

export class Wallet {
  walCode!: number;
  walIden!: string;
  walLabe?: string;
  walKey?: number;
  walEffBal?: number;
  walLogicBalance?: number;
  walSpecificBalance?: number;
  lastUpdatedDate?: string;
  walFinId?: number;

  customer?: Customer;
  walletStatus?: WalletStatus;
  walletType?: WalletType;
  walletCategory?: WalletCategory;
  walletOperations?: WalletOperations[];
  lastBalanceHistory?: WalletBalanceHistory;
  operationTypes?: OperationType[];
  cardList?: CardList;
  accountList?: AccountList[];
  walletOperationTypeMappings?: WalletOperationTypeMap[];

  constructor(init?: Partial<Wallet>) {
    this.walEffBal = 0
    this.walLogicBalance = 0
    this.walSpecificBalance = 0
    Object.assign(this, init);
  }
}