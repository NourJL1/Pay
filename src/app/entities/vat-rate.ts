export class VatRate {

    vatCode?: number;
  vatRate?: number; // use number, since Angular/TS don't have BigDecimal
  vatLabe?: string;
  vatIden?: string;
  vatActive?: number;

  constructor(init?: Partial<VatRate>) {
    Object.assign(this, init);
  }
}
