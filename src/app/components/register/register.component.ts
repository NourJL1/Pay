import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxIntlTelInputModule, CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from '../../services/customer.service';
import { error } from 'node:console';


interface City {
  name: string;
}

interface PhoneNumber {
  internationalNumber: string;
  nationalNumber: string;
  e164Number: string;
  countryCode: string;
  dialCode: string;
  number: string;
  isNumberValid?: boolean;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxIntlTelInputModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {


  currentStep = 1;

  countries: any[] = [];
  cities: string[] = [];

  phoneForm = new FormGroup({
    phone: new FormControl<PhoneNumber | null>(null, [
      Validators.required,
      this.validatePhoneNumber
    ])
  });

  selectedCountry: any;
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  preferredCountries: CountryISO[] = [
    CountryISO.Tunisia, // Added Tunisia since you're using +216
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom
  ];

  separateDialCode = true;
  searchCountryField = [
    SearchCountryField.Iso2,
    SearchCountryField.Name
  ];

  CUSTOMER = {
    username: '',
    cusMotDePasse: '',
    cusFirstName: '',
    cusMidName: '',
    cusLastName: '',
    fullname: '',
    cusPhoneNbr: '',
    cusMailAdress: '',
    identificationType: '',
    walletType: '',
    country: '',
    city: '',
    cusAdress: ''
  }


  errorMessage: string = '';
  successMessage: string = '';
  otpSent: boolean = false;
  otpVerified: boolean = false;
  otpCode: any;

  constructor(private customerService: CustomerService, private router: Router, private http: HttpClient) { }

  // Custom phone number validator
  private validatePhoneNumber(control: AbstractControl) {
    const phoneValue = control.value as PhoneNumber | null;
    if (!phoneValue) {
      return { required: true };
    }
    if (!phoneValue.e164Number) {
      return { invalidFormat: true };
    }
    if (phoneValue.isNumberValid === false) {
      return { invalidNumber: true };
    }
    return null;
  }

  goToNextStep() {

    console.log(this.CUSTOMER)

    // Step 1: Choosing a wallet type
    if (this.currentStep === 1) {
      if (!this.CUSTOMER.walletType) {
        this.errorMessage = 'Please choose a wallet type.';
        return;
      }
    }

    // Step 2: Validate Full Name and Username
    if (this.currentStep === 2) {
      if (!this.CUSTOMER.cusFirstName?.trim()/*  || !this.CUSTOMER.cusMidName?.trim() */ || !this.CUSTOMER.cusLastName?.trim() || !this.CUSTOMER.username?.trim()) {
        this.errorMessage = 'Please fill in both Full Name and Username.';
        return;
      }
    }

    // In the goToNextStep method, update the phone validation part:
    if (this.currentStep === 4) {
      const phoneControl = this.phoneForm.get('phone');

      if (!phoneControl?.value) {
        this.errorMessage = 'Please enter a phone number.';
        return;
      }

      // Check if the control is invalid
      if (phoneControl.invalid) {
        this.errorMessage = 'Please enter a valid phone number.';
        return;
      }

      const phoneValue = phoneControl.value as PhoneNumber;
      this.CUSTOMER.cusPhoneNbr = phoneValue.e164Number;
    }

    // Step 5: Validate Email and Password
    if (this.currentStep === 5) {
      if (!this.CUSTOMER.cusMailAdress?.trim() || !this.CUSTOMER.cusMotDePasse?.trim()) {
        this.errorMessage = 'Please enter your email and password.';
        return;
      }
    }

    // Clear any previous error and go to the next step
    this.errorMessage = '';
    this.currentStep++;
  }

  ngOnInit(): void {
    this.getCountries();
  }

  getCountries(): void {
    this.http.get<any>('https://countriesnow.space/api/v0.1/countries')
      .subscribe((response) => {
        this.countries = response.data.map((item: any) => item.country).sort();
      });
  }

  onCountryChange(): void {
    const countryName = this.CUSTOMER.country;
    if (countryName) {
      this.getCities(countryName);
    }
  }

  getCities(countryName: string): void {
    this.http.post<any>('https://countriesnow.space/api/v0.1/countries/cities', {
      country: countryName
    }).subscribe(
      (res) => {
        this.cities = res.data || [];
      },
      (error) => {
        console.error("Error fetching cities", error);
      }
    );
  }

  goToPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    // First validate the current step (step 6)
    if (this.currentStep === 6) {
      if (!this.CUSTOMER.identificationType) {
        this.errorMessage = 'Please select an identification type.';
        return;
      }
    }

    // Split fullname into first, middle, and last names
    const nameParts = this.CUSTOMER.fullname.trim().split(' ');
    this.CUSTOMER.cusFirstName = nameParts[0] || '';
    this.CUSTOMER.cusMidName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';
    this.CUSTOMER.cusLastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

    // Then handle phone number validation if we're coming from step 4
    if (this.phoneForm.invalid) {
      this.errorMessage = 'Please enter a valid phone number.';
      return;
    }

    const phoneValue = this.phoneForm.get('phone')?.value as PhoneNumber;
    this.CUSTOMER.cusPhoneNbr = phoneValue.e164Number;

    console.log(this.CUSTOMER)


    this.customerService.register(this.CUSTOMER).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage = 'Registration failed. Please try again.';
        this.successMessage = '';
      },
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log(file);
    }
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  sendOtp() {
    this.customerService.sendOTP(this.CUSTOMER.cusMailAdress).subscribe(
      {
        next: (Result: any) => {
          if (Result.message == 'success')
            this.otpSent = true;
        },
        error: (err) => {
          console.error('OTP mailing Failed: ', err);
        }
      });
  }

  verifyOtp() {
    this.customerService.verifyOTP(this.CUSTOMER.cusMailAdress, this.otpCode).subscribe({
      next: (verif: boolean) => {
        this.otpVerified = verif; // Direct assignment (no .valueOf needed)
        console.log('OTP Verification Result:', verif);
      },
      error: (err) => {
        console.error('OTP Verification Failed:', err);
        // Handle errors (e.g., show error message)
      }
    });
  }
}