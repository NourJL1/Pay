import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
import { WalletStatus } from '../../../entities/wallet-status';

@Component({
  selector: 'app-customer-mng',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-mng.component.html',
  styleUrl: './customer-mng.component.css'
})
export class CustomerMngComponent {

  constructor(
    private http: HttpClient,
    private customerService: CustomerService,
    private customerStatusService: CustomerStatusService,
    private customerIdentityTypeService: CustomerIdentityTypeService,
    private countryService: CountryService,
    private cityService: CityService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.customerService.getAllCustomersWithWallets().subscribe(
      {
        next: (customers: Customer[]) => { this.customers = customers },
        error: (err) => { console.log(err) }
      }
    )

    this.customerStatusService.getAll().subscribe(
      {
        next: (statuses: CustomerStatus[]) => { this.statuses = statuses },
        error: (err) => { console.log(err) }
      }
    )

    this.customerIdentityTypeService.getAll().subscribe(
      {
        next: (types: CustomerIdentityType[]) => { this.types = types },
        error: (err) => { console.log(err) }
      }
    )

    this.countryService.getAll().subscribe(
      {
        next: (countries: Country[]) => {
          this.countries = countries
          this.http.get<any>('https://countriesnow.space/api/v0.1/countries')
            .subscribe((response) => {
              const allCountries: Country[] = response.data.map((item: any) => ({
                ctrIden: item.iso2,  // Using ISO2 code as identifier
                ctrLabe: item.country // Using country name as label
              }))
              this.countryList = allCountries.filter((country: Country) => !this.countries.some(ctr => ctr.ctrIden === country.ctrIden))
            });
        },
        error: (err) => { console.log(err) }
      }
    )

    this.cityService.getAll().subscribe(
      {
        next: (cities: City[]) => { this.cities = cities },
        error: (err) => { console.log(err) }
      }
    )


  }

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
  selectedStatus?: CustomerStatus
  selectedIdentityType?: CustomerIdentityType
  selectedCountry?: Country
  selectedCity?: City

  statusForm: CustomerStatus = new CustomerStatus()
  identityTypeForm: CustomerIdentityType = new CustomerIdentityType()
  countryForm: Country = new Country()
  cityForm: City = new City()

  countryList: Country[] = []
  cityList: String[] = []

  successMessage: string | null = null;
  errorMessage: string | null = null;

  //class CountryDTO{ctrIden?: string; ctrLabe?: string}

  // customer methods

  deleteCustomer(customer: Customer) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(customer.username!).subscribe({
        next: () => { console.log("deleted succ") },
        error: (err) => { console.log(err) }
      })
    }
  }

  // status methods
  editStatus(status: CustomerStatus) {
    this.selectedStatus = status
    this.statusForm = { ...status }
    this.isCustomerStatusVisible = true
    this.cdr.detectChanges();
  }

  addStatus() {
    this.customerStatusService.create(this.statusForm).subscribe({
      next: (status: CustomerStatus) => {
        console.log('add Customer Status: status added:', status);
        this.statuses.push(status);
        this.statusForm = new CustomerStatus();
        this.isCustomerStatusVisible = false;
        this.showSuccessMessage('Customer Status added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('add Customer Staus: Error:', err);
        this.showErrorMessage('Failed to add customer status: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  updateStatus() {
    this.customerStatusService.update(this.statusForm.ctsCode!, this.statusForm).subscribe({
      next: (status: CustomerStatus) => {
        console.log('update status: status updated:', this.statusForm);
        const index = this.statuses.findIndex(cts => cts.ctsCode === this.statusForm.ctsCode);
        if (index !== -1) {
          this.statuses[index] = status;
          this.statuses = [...this.statuses];
        }
        this.statusForm = new CustomerStatus();
        this.selectedStatus = undefined;
        this.isCustomerStatusVisible = false;
        this.showSuccessMessage('Fee updated successfully');
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('updateFee: Error:', err);
        this.showErrorMessage('Failed to update fee: ' + (err.error?.message || 'Please try again.'));
      }
    })
}

deleteStatus(status: CustomerStatus) {
  if (confirm('Are you sure you want to delete this customer status?')) {
    this.customerStatusService.delete(status.ctsCode!).subscribe({
      next: () => {
        console.log("deleted succ")
        this.statuses = this.statuses.filter(cts => cts.ctsCode !== status?.ctsCode);
        this.showSuccessMessage('Customer Status deleted successfully');
        this.cdr.detectChanges();
      },
      error: (err) => { console.log(err) }
    })
  }
}

// identity type methods

editIdentityType(identityType: CustomerIdentityType) {
  this.selectedIdentityType = identityType
  this.identityTypeForm = { ...identityType }
  this.isCustomerIdentityTypeVisible = true
  this.cdr.detectChanges();
}

addIdentityType() {

}
updateIdentityType() {

}

deleteIdentityType(identityType: CustomerIdentityType) {
  if (confirm('Are you sure you want to delete this identity type?')) {
    this.customerIdentityTypeService.delete(identityType.citCode!).subscribe({
      next: () => { console.log("deleted succ") },
      error: (err) => { console.log(err) }
    })
  }
}

// country methods

addCountry() {
  this.countryService.create(this.countryForm).subscribe({
    next: (country: Country) => {
      console.log('add country: country added:', country);
      this.countries.push(country);
      this.countryForm = new Country();
      this.isCountryVisible = false;
      this.showSuccessMessage('Country added successfully');
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('add country: Error:', err);
      this.showErrorMessage('Failed to add country: ' + (err.error?.message || 'Please check the form.'));
    }
  })
}

deleteCountry(country: Country) {
  if (confirm('Are you sure you want to delete this country?')) {
    this.countryService.delete(country.ctrCode!).subscribe({
      next: () => {
        console.log("deleted succ")
        this.countries = this.countries.filter(ctr => ctr.ctrCode !== country.ctrCode);
        this.showSuccessMessage('Country deleted successfully');
        this.cdr.detectChanges();
      },
      error: (err) => { console.log(err) }
    })
  }
}

//city methods

addCity() {
  console.log(this.cityForm)

  this.cityService.create(this.cityForm).subscribe({
    next: (city: City) => {
      console.log('add city: city added:', city);
      this.cities.push(city);
      this.cityForm = new City();
      this.isCityVisible = false;
      this.showSuccessMessage('City added successfully');
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('add city: Error:', err);
      this.showErrorMessage('Failed to add city: ' + (err.error?.message || 'Please check the form.'));
    }
  })
}

deleteCity(city: City) {
  if (confirm('Are you sure you want to delete this city?')) {
    this.cityService.delete(city.ctyCode!).subscribe({
      next: () => { console.log("deleted succ") },
      error: (err) => { console.log(err) }
    })
  }
}

onCountryChange(): void {
  this.http.post("https://countriesnow.space/api/v0.1/countries/cities", { country: this.cityForm.country?.ctrLabe }).subscribe(
    {
      next: (cities: any) => {
        cities.data.filter((city: string) => !this.cities.some(cty => cty.ctyLabe === city))
        this.cityList = cities.data
      },
      error: (err) => { console.log(err) }
    }
  )
}

// html methods

toggleForm(modal: string) {
  switch (modal) {
    case 'customer-details': this.isUserDetailsVisible = true; break;
    case 'customer-status':
      this.selectedStatus = undefined;
      this.statusForm = new CustomerStatus()
      this.isCustomerStatusVisible = true;
      break;
    case 'customer-identityType':
      this.selectedIdentityType = undefined
      this.identityTypeForm = new CustomerIdentityType()
      this.isCustomerIdentityTypeVisible = true;
      break;
    case 'country':
      this.selectedCountry = undefined
      this.countryForm = new Country()
      this.isCountryVisible = true;
      break;
    case 'city':
      this.selectedCity = undefined
      this.cityForm = new City()
      this.isCityVisible = true;
      break;
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

showTab(tabId: string, tabType ?: string): void {

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

// Show success message
showSuccessMessage(message: string): void {
  console.log('showSuccessMessage:', message);
  this.successMessage = message;
  this.errorMessage = null;
  setTimeout(() => {
  this.successMessage = null;
  this.cdr.detectChanges();
}, 3000);
  }

// Show error message
showErrorMessage(message: string): void {
  console.log('showErrorMessage:', message);
  this.errorMessage = message;
  this.successMessage = null;
  setTimeout(() => {
  this.errorMessage = null;
  this.cdr.detectChanges();
}, 3000);
  }

// Clear messages
clearMessage(): void {
  console.log('clearMessage: Clearing messages');
  this.successMessage = null;
  this.errorMessage = null;
  this.cdr.detectChanges();
}
}
