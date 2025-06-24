import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CountryService } from '../../../services/country.service';
import { HttpClient } from '@angular/common/http';
import { Customer, CustomerService } from '../../../services/customer.service';
import { CustomerStatusService } from '../../../services/customer-status.service';
import { CustomerStatus } from '../../../entities/customer-status';
import { City } from '../../../entities/city';
import { CustomerIdentityType } from '../../../entities/customer-identity-type';
import { CityService } from '../../../services/city.service';
import { CustomerIdentityTypeService } from '../../../services/customer-identity-type.service';
import { Country } from '../../../entities/country';

@Component({
  selector: 'app-customer-mng',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-mng.component.html',
  styleUrl: './customer-mng.component.css'
})
export class CustomerMngComponent {
  addCustomerStatus() {
    throw new Error('Method not implemented.');
  }
  updateCustomerStatus() {
    throw new Error('Method not implemented.');
  }

  constructor(
    private http: HttpClient,
    private customerService: CustomerService,
    private customerStatusService: CustomerStatusService,
    private customerIdentityTypeService: CustomerIdentityTypeService,
    private countryService: CountryService,
    private cityService: CityService) { }

  isUserDetailsVisible: boolean = false;
  isCustomerStatusVisible: boolean = false;
  isCustomerIdentityTypeVisible: boolean = false;
  isCountryVisible: boolean = false;
  isCityVisible: boolean = false;

  countries: Country[] = []
  cities: City[] = []
  customers: Customer[] = []
  statuses: CustomerStatus[] = []
  types: CustomerIdentityType[] = []

  selectedCustomer?: Customer
  selectedStatus?: CustomerStatus;
  selectedType?: CustomerIdentityType

  countryLabels: String[] = []
  countryIdens: String[] = []


  ngOnInit(): void {
    this.customerService.getAllCustomers().subscribe(
      {
        next: (customers: Customer[]) => {
          this.customers = customers
        },
        error: (err) => {
          console.log(err)
        }
      }
    )

    this.customerStatusService.getAll().subscribe(
      {
        next: (statuses: CustomerStatus[]) => {
          this.statuses = statuses
        },
        error: (err) => {
          console.log(err)
        }
      }
    )

    this.customerIdentityTypeService.getAll().subscribe(
      {
        next: (types: CustomerIdentityType[]) => {
          this.types = types
        },
        error: (err) => {
          console.log(err)
        }
      }
    )

    this.countryService.getAll().subscribe(
      {
        next: (countries: Country[]) => {
          this.countries = countries
        },
        error: (err) => {
          console.log(err)
        }
      }
    )

    this.cityService.getAll().subscribe(
      {
        next: (cities: City[]) => {
          this.cities = cities
        },
        error: (err) => {
          console.log(err)
        }
      }
    )

    this.http.get<any>('https://countriesnow.space/api/v0.1/countries')
      .subscribe((response) => {
        this.countryLabels = response.data.map((item: any) => item.country).sort();
        this.countryIdens = response.data.map((item: any) => item.iso2).sort();
      });
  }

  toggleForm(modal: string) {
    switch (modal) {
      case 'customer-details': this.isUserDetailsVisible = true; break;
      case 'customer-status': this.isCustomerStatusVisible = true; break;
      case 'customer-identityType': this.isCustomerIdentityTypeVisible = true; break;
      case 'country': this.isCountryVisible = true; break;
      case 'city': this.isCityVisible = true; break;
    }
  }

  closeForm(modal: string) {
    switch (modal) {
      case 'customer-details': this.isUserDetailsVisible = false; break;
      case 'customer-status': this.isCustomerStatusVisible = false; break;
      case 'customer-identityType': this.isCustomerIdentityTypeVisible = false; break;
      case 'country': this.isCountryVisible = false; break;
      case 'city': this.isCityVisible = false; break;
    }
  }

  get isAnyModalVisible(): boolean {
    return (
      this.isUserDetailsVisible ||
      this.isCustomerStatusVisible ||
      this.isCustomerIdentityTypeVisible ||
      this.isCountryVisible ||
      this.isCityVisible
    );
  }

  showTab(tabId: string, tabType?: string): void {

    const buttonClass = tabType ? `${tabType}-tab-button` : 'tab-button';
    const contentClass = tabType ? `${tabType}-tab-content` : 'tab-content';
    const tabButtons = document.querySelectorAll(`.${buttonClass}`);
    const tabContents = document.querySelectorAll(`.${contentClass}`);

    // Reset all buttons and contents
    tabButtons.forEach(btn => {
      btn.classList.remove('active', 'text-primary', 'font-medium');
      btn.classList.add('text-gray-500');
    });

    tabContents.forEach(content => content.classList.add('hidden'));

    // Activate the clicked button and show its tab content
    const activeButton = tabType ? document.getElementById(tabType + '-' + tabId) : document.getElementById(tabId);
    activeButton?.classList.add('active', 'text-primary', 'font-medium');
    activeButton?.classList.remove('text-gray-500');

    const activeId = tabType ? `${tabType}-tab-${tabId}` : `tab-${tabId}`;
    const activeContent = document.getElementById(activeId);
    activeContent?.classList.remove('hidden');
  }

  previewDocument(type: string) {

    const activeDoc = document.getElementById('document-preview')
    activeDoc?.classList.remove('hidden');

    const frames = document.querySelectorAll('.doc-frame')
    frames.forEach(content => content.classList.add('hidden'))

    const typeFrame = document.getElementById(type)
    typeFrame?.classList.remove('hidden')
  }

  closePreview() {
    const activeDoc = document.getElementById('document-preview')
    activeDoc?.classList.add('hidden');

    const frames = document.querySelectorAll('.doc-frame')
    frames.forEach(content => content.classList.add('hidden'))
  }
}
