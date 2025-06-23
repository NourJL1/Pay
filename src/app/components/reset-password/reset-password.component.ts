import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  imports: [],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  togglePassword(fieldId: string): void {
    const input = document.getElementById(fieldId) as HTMLInputElement;
    const icon = input.nextElementSibling?.querySelector('i');

    if (input && icon) {
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('ri-eye-line', 'ri-eye-off-line');
      } else {
        input.type = 'password';
        icon.classList.replace('ri-eye-off-line', 'ri-eye-line');
      }
    }
  }

  // Form submission handler
  onSubmit(): void {
    // Add your password reset logic here
    console.log('Password reset submitted');
  }

}
