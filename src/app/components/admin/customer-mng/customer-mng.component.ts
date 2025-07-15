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
import { DocType } from '../../../entities/doc-type';
import { DocTypeService } from '../../../services/doc-type.service';
import { CustomerDoc } from '../../../entities/customer-doc';
import { CustomerDocService } from '../../../services/customer-doc.service';

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
    private customerDocService: CustomerDocService,
    private docTypeService: DocTypeService,
    private countryService: CountryService,
    private cityService: CityService,
    private cdr: ChangeDetectorRef) { }

  isAddCustomerVisible: boolean = false;
  isUserDetailsVisible: boolean = false;
  isCustomerStatusVisible: boolean = false;
  isCustomerIdentityTypeVisible: boolean = false;
  isDocTypeVisible: boolean = false;
  isCountryVisible: boolean = false;
  isCityVisible: boolean = false;

  countries: Country[] = [] // List of countries from db
  cities: City[] = [] // List of all cities from db
  citiesByCountry: City[] = [] // List of cities from db by countries
  customers: Customer[] = [] // List of customers
  statuses: CustomerStatus[] = [] // List of customer statuses
  identityTypes: CustomerIdentityType[] = [] // List of customer identity types
  docTypeList: DocType[] = [] // List of document types in db
  

  // Selected items for editing
  selectedCustomer?: Customer
  selectedStatus?: CustomerStatus
  selectedIdentityType?: CustomerIdentityType
  selectedDoc?: CustomerDoc
  selectedDocType?: DocType;
  selectedCountry?: Country
  selectedCity?: City

  // Forms for adding/editing
  customerForm: Customer = new Customer()
  statusForm: CustomerStatus = new CustomerStatus()
  identityTypeForm: CustomerIdentityType = new CustomerIdentityType()
  docTypeForm: DocType = new DocType;
  countryForm: Country = new Country()
  cityForm: City = new City()

  docTypes: DocType[] = [] // List of document types not in db
  countryList: Country[] = [] // List of countries not in db
  cityList: String[] = [] // List of cities not in db

  successMessage: string | null = null;
  errorMessage: string | null = null;

  files: File[] = []


  allowedDocTypes: string[] = [] // List of allowed document types
  confirm?: string;


  ngOnInit(): void {
    this.loadAllCustomers()
    this.loadIdentityTypes()
    this.loadDocTypes()
    this.loadCountries()
    this.loadCities()
  }

  loadAllCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (customers: Customer[]) => { this.customers = customers },
      error: (err) => { console.log(err) }
    })

    this.customerStatusService.getAll().subscribe({
      next: (statuses: CustomerStatus[]) => { this.statuses = statuses },
      error: (err) => { console.log(err) }
    })
  }

  loadIdentityTypes() {
    this.customerIdentityTypeService.getAll().subscribe({
      next: (types: CustomerIdentityType[]) => { this.identityTypes = types },
      error: (err) => { console.log(err) }
    })
  }

  loadDocTypes() {
    this.docTypeService.getAll().subscribe({
      next: (types: DocType[]) => {
        this.docTypes = types
        this.http.get<any>('assets/documentTypes.json')
          .subscribe((response) => {
            const allDocTypes: DocType[] = response.documentTypes
            this.docTypeList = allDocTypes.filter((docType: DocType) => !this.docTypes.some(dty => dty.dtyIden === docType.dtyIden))
            this.allowedDocTypes = this.docTypes.map(type => type.dtyIden!)
          });
      },
      error: (err) => { console.log(err) }
    })
  }

  loadCountries() {
    this.countryService.getAll().subscribe({
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
    })
  }

  loadCities() {
    this.cityService.getAll().subscribe({
      next: (cities: City[]) => { this.cities = cities },
      error: (err) => { console.log(err) }
    })
  }

  // customer methods

  editCustomer(customer: Customer) {
    this.selectedCustomer = customer
    this.customerForm = { ...customer, fullName: customer.fullName }
    this.isAddCustomerVisible = true
    this.cdr.detectChanges();
  }

  addCustomer() {
    this.customerForm.identity!.customerDocListe!.cdlLabe = this.customerForm.identity?.customerIdentityType?.citLabe + '-' + this.customerForm.username
    this.customerService.register(this.customerForm).subscribe({
      next: (customer: Customer) => {
        console.log('add Customer: cus added:', customer);
        const customerDocs: CustomerDoc[] = customer.identity?.customerDocListe?.customerDocs || [];
        for (let i = 0; i < customerDocs.length; i++) {
          customerDocs[i].customerDocListe = customer.identity?.customerDocListe
          this.customerDocService.create(customerDocs[i], this.files[i]).subscribe({
            next: () => { console.log("docs succ") },
            error: (err) => { console.log(err) }
          })
        }
        this.customers.push(customer);
        this.customerForm = new Customer();
        this.citiesByCountry = [];
        this.files = [];
        this.isAddCustomerVisible = false;
        this.showSuccessMessage('Customer added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('add Customer: Error:', err);
        this.showErrorMessage('Failed to add customer: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  updateCustomer() {
    console.log('update customer:', this.customerForm);
    this.customerService.updateCustomer(this.customerForm.cusCode!, this.customerForm).subscribe({
      next: (customer: Customer) => {
        console.log('update customer: updated:', this.customerForm);
        const index = this.customers.findIndex(cus => cus.cusCode === this.customerForm.cusCode);
        if (index !== -1) {
          this.customers[index] = customer;
          this.customers = [...this.customers];
        }
        this.customerForm = new Customer();
        this.selectedCustomer = undefined;
        this.citiesByCountry = [];
        this.files = [];
        this.isAddCustomerVisible = false;
        this.showSuccessMessage('Customer updated successfully');
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('update Customer: Error:', err);
        this.showErrorMessage('Failed to update customer: ' + (err.error?.message || 'Please try again.'));
      }
    })
  }

  onFileSelected(event: Event): void {
    const maxFileSize = 10 * 1024 * 1024;

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach((file => {
        if (file.size > maxFileSize) {
          alert(`File "${file.name}" exceeds the maximum size of 10MB.`);
          return; // Skip this file
        }
        const matchedDocType = this.docTypes.find(dt => dt.dtyIden === file.type)

        this.customerForm.identity?.customerDocListe?.customerDocs?.push(new CustomerDoc({
          cdoLabe: file.name,
          docType: matchedDocType,
        }))
        this.files.push(file)
      }))
    }
  }

  deleteCustomer(customer: Customer) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(customer.cusCode!).subscribe({
        next: () => {
          console.log("deleted succ")
          this.customers = this.customers.filter(cus => cus.cusCode !== customer?.cusCode);
          this.showSuccessMessage('Customer deleted successfully');
          this.cdr.detectChanges();
        },
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
        this.showSuccessMessage('status updated successfully');
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('updateStatus: Error:', err);
        this.showErrorMessage('Failed to update status: ' + (err.error?.message || 'Please try again.'));
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
    this.customerIdentityTypeService.create(this.identityTypeForm).subscribe({
      next: (identityType: CustomerIdentityType) => {
        console.log('add Customer Identity Type: identity added:', identityType);
        this.identityTypes.push(identityType);
        this.identityTypeForm = new CustomerIdentityType();
        this.isCustomerIdentityTypeVisible = false;
        this.showSuccessMessage('Customer identity type added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('add Customer identity type: Error:', err);
        this.showErrorMessage('Failed to add customer identity type: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  updateIdentityType() {
    this.customerIdentityTypeService.update(this.identityTypeForm.citCode!, this.identityTypeForm).subscribe({
      next: (identityType: CustomerIdentityType) => {
        console.log('update identity type: identity type updated:', this.identityTypeForm);
        const index = this.identityTypes.findIndex(cit => cit.citCode === this.identityTypeForm.citCode);
        if (index !== -1) {
          this.identityTypes[index] = identityType;
          this.identityTypes = [...this.identityTypes];
        }
        this.identityTypeForm = new CustomerIdentityType();
        this.selectedIdentityType = undefined;
        this.isCustomerIdentityTypeVisible = false;
        this.showSuccessMessage('identity type updated successfully');
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('updateIdentityType: Error:', err);
        this.showErrorMessage('Failed to update identity type: ' + (err.error?.message || 'Please try again.'));
      }
    })
  }

  deleteIdentityType(identityType: CustomerIdentityType) {
    if (confirm('Are you sure you want to delete this identity type?')) {
      this.customerIdentityTypeService.delete(identityType.citCode!).subscribe({
        next: () => {
          console.log("deleted succ")
          this.identityTypes = this.identityTypes.filter(cit => cit.citCode !== identityType?.citCode);
          this.showSuccessMessage('Customer identity type deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  // doc type methods

  editDocType(docType: DocType) {
    this.selectedDocType = docType
    this.docTypeForm = { ...docType }
    this.isDocTypeVisible = true
    this.cdr.detectChanges();
  }

  addDocType() {
    console.log(this.identityTypeForm)
    this.docTypeService.create(this.docTypeForm).subscribe({
      next: (docType: DocType) => {
        console.log('add Doc Type: identity added:', docType);
        this.docTypes.push(docType);
        this.allowedDocTypes.push(docType.dtyIden!);
        this.docTypeForm = new DocType();
        this.isDocTypeVisible = false;
        this.showSuccessMessage('Document type added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('add document type: Error:', err);
        this.showErrorMessage('Failed to add document type: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  deleteDocType(docType: DocType) {
    if (confirm('Are you sure you want to delete this document type?')) {
      this.docTypeService.delete(docType.dtyCode!).subscribe({
        next: () => {
          console.log("deleted succ")
          this.docTypes = this.docTypes.filter(dty => dty.dtyCode !== docType?.dtyCode);
          this.allowedDocTypes = this.docTypes
            .filter(dty => dty.dtyIden !== docType?.dtyIden)
            .map(dty => dty.dtyIden!);
          this.showSuccessMessage('Document Type deleted successfully');
          this.cdr.detectChanges();
        },
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
    this.cityForm.ctyIden = this.cityForm.country?.ctrIden + '-' +
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
    this.cityService.getByCountry(this.customerForm.country!).subscribe(
      {
        next: (cities: City[]) => {
          this.citiesByCountry = cities;
        },
        error: (err) => {
          console.log(err)
        }
      }
    );
  }

  onAllCountryChange(): void {
    this.http.post("https://countriesnow.space/api/v0.1/countries/cities", { country: this.cityForm.country?.ctrLabe }).subscribe({
      next: (response: any) => {
        const allCities = response.data.filter((city: string) => !this.cities.some(cty => cty.ctyLabe === city))
        this.cityList = allCities.filter((city: City) => !this.cities.some(cty => cty.ctyLabe === city.ctyLabe))
      },
      error: (err) => { console.log(err) }
    })
  }

  // html methods

  toggleForm(modal: string) {
    switch (modal) {
      case 'customer-add':
        this.selectedCustomer = undefined;
        this.customerForm = new Customer()
        this.isAddCustomerVisible = true;
        break;
      case 'customer-details':
        this.isUserDetailsVisible = true;
        this.customerDocService.getByCustomerDocListe(this.selectedCustomer?.identity?.customerDocListe?.cdlCode!).subscribe({
          next: (docs: CustomerDoc[]) => {
            this.selectedCustomer!.identity!.customerDocListe!.customerDocs = docs
            this.cdr.detectChanges();
          }
          /* next: (docs: any) => {
            this.selectedCustomer!.identity!.customerDocListe!.customerDocs = [];
            this.files = [];
            docs.forEach((doc: any) => {
              this.selectedCustomer?.identity?.customerDocListe?.customerDocs?.push(doc.customerDoc)
              this.files.push(doc.file);
            })
            this.cdr.detectChanges();
          } */,
          error: (err) => { console.log(err) }
        })
        break;
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
      case 'docType':
        this.selectedDocType = undefined
        this.docTypeForm = new DocType()
        this.isDocTypeVisible = true;
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
      case 'customer-add': 
        this.citiesByCountry = [];
        this.isAddCustomerVisible = false; 
        break;
      case 'customer-details': this.isUserDetailsVisible = false; break;
      case 'customer-status': this.isCustomerStatusVisible = false; break;
      case 'customer-identityType': this.isCustomerIdentityTypeVisible = false; break;
      case 'docType': this.isDocTypeVisible = false; break;
      case 'country': this.isCountryVisible = false; break;
      case 'city': 
        this.cityList = [];
        this.isCityVisible = false; 
        break;
    }
  }

  get isAnyModalVisible(): boolean {
    return (
      this.isAddCustomerVisible ||
      this.isUserDetailsVisible ||
      this.isCustomerStatusVisible ||
      this.isCustomerIdentityTypeVisible ||
      this.isDocTypeVisible ||
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
      btn.classList.remove('active', 'text-primary', 'font-medium', 'border-b-2', 'border-primary', 'transition-colors');
      btn.classList.add('text-gray-500');
    });

    tabContents.forEach(content => content.classList.add('hidden'));

    // Activate the clicked button and show its tab content
    const activeButton = tabType ? document.getElementById(tabType + '-' + tabId) : document.getElementById(tabId);
    activeButton?.classList.add('active', 'text-primary', 'font-medium', 'border-b-2', 'border-primary', 'transition-colors');
    activeButton?.classList.remove('text-gray-500');

    const activeId = tabType ? `${tabType}-tab-${tabId}` : `tab-${tabId}`;
    const activeContent = document.getElementById(activeId);
    activeContent?.classList.remove('hidden');
  }

  fileData: any

  previewDocument(customerDoc: CustomerDoc, index: number) {
    this.customerDocService.getFileById(customerDoc.cdoCode!)/* .subscribe({
      next: (doc: any) => {
        
      }
    }) */

    this.selectedDoc = customerDoc
    console.log(this.selectedDoc)

    /* const activeDoc = document.getElementById('document-preview')
    activeDoc?.classList.remove('hidden');

    const frames = document.querySelectorAll('.doc-frame')
    frames.forEach(content => content.classList.add('hidden'))

    const typeFrame = document.getElementById(type)
    typeFrame?.classList.remove('hidden') */
  }

  closePreview() {

    this.selectedDoc = undefined

    //const activeDoc = document.getElementById('document-preview')
    //activeDoc?.classList.add('hidden');

    //const frames = document.querySelectorAll('.doc-frame')
    //frames.forEach(content => content.classList.add('hidden'))
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
