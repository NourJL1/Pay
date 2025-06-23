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
  message: string = '';
  loading: boolean = false;
  email: any;

  constructor(private customerService: CustomerService) { }

  onSubmit() {
    this.loading = true;  // Show loading indicator
    console.log(this.email)
    this.customerService.sendEmail(this.email, "Reset Password").subscribe(
      {
        next: (Result: any) => {
          if (Result.message == 'success')
            console.log("yaay")
        },
        error: (err) => {
          console.error('mailing Failed: ', err);
        }
      });
  }

}
