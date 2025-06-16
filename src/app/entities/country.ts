
import { City } from './city';

export class Country {

     ctrCode?: number;
  ctrIden?: string;
  ctrLabe?: string;
  cities?: City[];

  constructor(init?: Partial<Country>) {
    Object.assign(this, init);
  }
}
