import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common';  // Import CommonModule
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],  // Add FormsModule and CommonModule
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  isLoading: boolean = false;
  email: any;
  errorMessage?: string;
  successMessage?: string;

  constructor(private customerService: CustomerService) { }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;  // Show loading indicator
    console.log(this.email)
    this.customerService.getCustomerByEmail(this.email).subscribe(
      {
        next: (value: any) => {
          this.customerService.sendEmail(this.email, "Reset Password").subscribe(
            {
              next: (Result: any) => {
                if (Result.message == 'success') {
                  this.successMessage = 'An email has been sent to your address with instructions to reset your password.';
                  localStorage.setItem('cusCode', value.cusCode)
                }
              },
              error: (err) => {
                this.errorMessage = 'Failed to send email. Please try again.';
                console.error('mailing Failed: ', err);
              }
            });

        },
        error: (err) => {
          console.log(err)
          if (err.status === 404) {
            this.errorMessage = 'Email not found in our system';
          } else {
            this.errorMessage = 'An error occurred while checking your email';
            console.error('Email lookup failed:', err);
          }
        }
      }
    )
    this.isLoading = false;  // Hide loading indicator
  }

}
