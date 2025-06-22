import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],  // Add FormsModule and CommonModule
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.loading = true;  // Show loading indicator

    this.http.post('http://localhost:8080/api/auth/forgot-password', { email: this.email })
      .subscribe({
        next: () => {
          this.message = 'A reset link has been sent to your email.';
          this.email = ''; // Clear the email field
        },
        error: () => {
          this.message = 'Error sending reset link. Try again later.';
        },
        complete: () => {
          this.loading = false;  // Hide loading indicator when the request completes
        }
      });
  }
}
