import { Routes } from '@angular/router';
import { HomeComponent } from './components/security/home/home.component';
import { LoginComponent } from './components/security/login/login.component';
import { RegisterComponent } from './components/security/register/register.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { ForgotPasswordComponent } from './components/security/forgot-password/forgot-password.component';
import { WalletComponent } from './components/security/wallet/wallet.component';
import { walletStatusGuard } from './guards/wallet-status.guard';
import { SideNavComponent } from './components/security/admin-dashboard/side-nav/side-nav.component'; 
import { DashboardComponent } from './components/security/admin-dashboard/dashboard/dashboard.component';
import { WelcomeComponent } from './components/security/wallet/welcome/welcome.component';
import { AccountingComponent } from './components/security/admin-dashboard/accounting/accounting.component';
import { WalletMngComponent } from './components/security/admin-dashboard/wallet-mng/wallet-mng.component';
import { ProductsComponent } from './components/security/admin-dashboard/products/products.component';
import { ProfilingComponent } from './components/security/admin-dashboard/profiling/profiling.component';
import { CustomerMngComponent } from './components/security/admin-dashboard/customer-mng/customer-mng.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

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

  // Redirects
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'admin', 
    component: SideNavComponent, 
    canActivate: [AuthGuard],
    data: { role: 'ROLE_ADMIN' },
    children:
    [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'accounting', component: AccountingComponent},
      {path: 'wallets', component: WalletMngComponent},
      {path: 'products', component: ProductsComponent},
      {path: 'profiling', component: ProfilingComponent},
      {path: 'customers', component: CustomerMngComponent},
    ]
}
];