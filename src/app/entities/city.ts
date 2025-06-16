import { Country } from './country'; // Adjust the path as needed


export class City {

    ctyCode?: number;
  ctyIden?: number;
  ctyLabe?: string;
  country?: Country;

  constructor(init?: Partial<City>) {
    Object.assign(this, init);
  }
}
