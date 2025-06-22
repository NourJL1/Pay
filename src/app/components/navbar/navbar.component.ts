import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
})
export class NavbarComponent {
  constructor(private router: Router) {}

  logout() {
    // Here you might also want to clear any user session/tokens
    // For example:
    // localStorage.removeItem('authToken');
    
    // Redirect to login page
    this.router.navigate(['/login']);
  }
}
