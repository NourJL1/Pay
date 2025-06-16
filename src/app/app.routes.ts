import { Routes } from '@angular/router';
import { HomeComponent } from './components/security/home/home.component';
import { LoginComponent } from './components/security/login/login.component';
import { RegisterComponent } from './components/security/register/register.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { ForgotPasswordComponent } from './components/security/forgot-password/forgot-password.component';
import { WalletComponent } from './components/security/wallet/wallet.component';
import { NavbarComponent } from './components/security/navbar/navbar.component';
import { AdminDashboardComponent } from './components/security/admin-dashboard/admin-dashboard.component';
import { walletStatusGuard } from './guards/wallet-status.guard';
import { SideNavComponent } from './components/security/admin-dashboard/side-nav/side-nav.component'; 
import { DashboardComponent } from './components/security/admin-dashboard/dashboard/dashboard.component';
import { PendingComponent } from './components/security/wallet/pending/pending.component';
import { WelcomeComponent } from './components/security/wallet/welcome/welcome.component';
import { SettingsComponent } from './components/security/wallet/settings/settings.component';
import { AccountingComponent } from './components/security/admin-dashboard/accounting/accounting.component';
import { WalletMngComponent } from './components/security/admin-dashboard/wallet-mng/wallet-mng.component';
import { ProductsComponent } from './components/security/admin-dashboard/products/products.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'welcome', component: WelcomeComponent},
  //{ path: 'wallet', component: WalletComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'side-nav', component: SideNavComponent},

  // Protected routes
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_USER' }
  },
  {
    path: 'wallet',
    component: WalletComponent,
    canActivate: [AuthGuard, walletStatusGuard],
    data: { requiredStatus: 'ACTIVE' }
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [AuthGuard, walletStatusGuard],
    data: { requiredStatus: 'PENDING' }
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_ADMIN' }
  },

  // Navbar route (if still needed)
  { path: 'navbar', component: NavbarComponent },

  // Redirects
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'account', component: SideNavComponent, children:
    [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'accounting', component: AccountingComponent},
      {path: 'wallets', component: WalletMngComponent},
      {path: 'products', component: ProductsComponent},
      //{path: 'transactions', component: },
    ]
},

  /* { 
    path: 'wallet', 
    component: WalletComponent,
    canActivate: [AuthGuard, walletStatusGuard],
    data: {role: 'ROLE_CUSTOMER', requiredStatus: 'ACTIVE'},
    children:
    [
      {path: 'welcome', component: WelcomeComponent},
      {path: 'settings', component: SettingsComponent}
    ]
  },
  {
    path: 'pending',
    component: PendingComponent,
    canActivate: [walletStatusGuard, AuthGuard],
    data: { requiredStatus: 'PENDING', role: 'CUSTOMER_ROLE' }
  }, */
];