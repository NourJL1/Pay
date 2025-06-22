import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { walletStatusGuard } from './guards/wallet-status.guard';
import { SideNavComponent } from './components/admin-dashboard/side-nav/side-nav.component'; 
import { DashboardComponent } from './components/admin-dashboard/dashboard/dashboard.component';
import { WelcomeComponent } from './components/wallet/welcome/welcome.component';
import { AccountingComponent } from './components/admin-dashboard/accounting/accounting.component';
import { WalletMngComponent } from './components/admin-dashboard/wallet-mng/wallet-mng.component';
import { ProductsComponent } from './components/admin-dashboard/products/products.component';
import { ProfilingComponent } from './components/admin-dashboard/profiling/profiling.component';
import { CustomerMngComponent } from './components/admin-dashboard/customer-mng/customer-mng.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
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