import { Role } from './role';
import { CustomerContacts } from './customer-contacts';
import { CustomerStatus } from './customer-status';
import { CustomerIdentity } from './customer-identity';
import { City } from './city';
import { Country } from './country';
import { Wallet } from './wallet';
import { WalletOperations } from './wallet-operations';
export class Customer {
cusCode?: number;
  cusFirstName?: string;
  cusMidName?: string;
  cusLastName?: string;
  cusMailAddress?: string;
  cusMotDePasse?: string;
  cusPhoneNbr?: string;
  cusAddress?: string;
  cusIden?: string;
  cusFinId?: number;

  contacts?: CustomerContacts[];
  status?: CustomerStatus;
  identity?: CustomerIdentity;
  city?: City;
  country?: Country;
  wallets?: Wallet[];
  walletOperations?: WalletOperations[];
  username: string;

  roles: Role[];

  constructor(
    cusCode: number,
    cusFirstName: string,
    cusMidName: string,
    cusLastName: string,
    username: string,
    cusMailAddress: string,
    roles: Role[] = [],
    cusMotDePasse: string,
    cusPhoneNbr: string ,
    cusAddress: string ,
    cusIden: string ,
  ){
    this.cusCode = cusCode;
    this.cusFirstName = cusFirstName;
    this.cusMidName = cusMidName;
    this.cusLastName = cusLastName;
    this.username = username;
    this.cusMailAddress = cusMailAddress;
    this.roles = roles;
    this.cusMotDePasse = cusMotDePasse;
    this.cusPhoneNbr = cusPhoneNbr;
    this.cusAddress = cusAddress;
    this.cusIden = cusIden;
  }
    
}
