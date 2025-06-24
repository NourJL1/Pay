import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  passwordsMismatch: boolean = false
  password: string = ''
  confirm: string = ''

  constructor(private customerService: CustomerService, private router: Router) { }

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

    if (this.password != this.confirm)
      this.passwordsMismatch = true
    else {
      const cusCode = localStorage.getItem("cusCode")

      this.customerService.resetPassword(Number(cusCode), this.password).subscribe(
        {
          next: (value: any) => {
            console.log(value.message)
            if (value.message == "success") {
              console.log('Password reset submitted');
              localStorage.clear();
              this.router.navigate(['/login']);
            }

          },
          error: (err) => {
            console.log(err);
          },
        }
      )
    }


  }

}
