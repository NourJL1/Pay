
import { FeeRuleType } from './fee-rule-type';
import { FeeSchema } from './fee-schema';
import { VatRate } from './vat-rate';

export class FeeRule {

     fruCode?: number;
  fruIden!: string;
  fruLabe!: string;
  fruPrimaryWalletId!: string;
  fruPrimaryAmount!: number;
  fruPrimaryFeesId!: number;
  fruFeesWalletId!: number;
  fruFeesAmount!: number;
  fruTva?: VatRate;
  fruTvaWalletId!: number;
  fruTvaAmount!: number;
  fruSens!: string;
  feeRuleType!: FeeRuleType;
  feeSchema!: FeeSchema;

  constructor(init?: Partial<FeeRule>) {
    Object.assign(this, init);
  }
}
