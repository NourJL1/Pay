import { Role } from './role';
import { Wallet } from './wallet';
export class Customer {
  cusCode: number;
  cusFirstName: string;
  cusMidName: string;
  cusLastName: string;
  username: string;
  cusMailAddress: string;
  roles: Role[];
  cusMotDePasse: string;
  cusPhoneNbr: string;
  cusAddress: string;
  cusIden: string;

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
