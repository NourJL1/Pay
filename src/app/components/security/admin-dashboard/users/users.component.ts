import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../entities/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WalletStatus } from '../../../../entities/wallet';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  currentPage = 1;
  itemsPerPage = 25;
  totalItems = 0;
  searchTerm = '';
  statusFilter = 'all';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...users];
        this.totalItems = users.length;
        this.applyFilters();
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.fullname.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                           user.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.phoneNbr?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || 
                           (user.wallet && user.wallet.status.toLowerCase() === this.statusFilter.toLowerCase());
      
      return matchesSearch && matchesStatus;
    });
    
    this.totalItems = this.filteredUsers.length;
    this.currentPage = 1; // Reset to first page when filters change
  }

  changeStatus(user: User, newStatus: WalletStatus): void {
    if (user.wallet) {
      const previousStatus = user.wallet.status;
      user.wallet.status = newStatus;
      
      this.userService.updateWalletStatus(user.wallet.id, newStatus).subscribe({
        next: () => {
          console.log('Status updated successfully');
        },
        error: (err) => {
          console.error('Error updating status:', err);
          if (user.wallet) {
            user.wallet.status = previousStatus; // Revert on error
          }
        }
      });
    }
  }

  getStatusClass(status: WalletStatus): string {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'BLOCKED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      case 'MANAGER': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  currentDate = new Date();
walletStatusValues = Object.values(WalletStatus);

  getStatusColor(status: WalletStatus): string {
    switch (status) {
      case WalletStatus.ACTIVE:
        return 'text-green-500';
      case WalletStatus.INACTIVE:
        return 'text-red-500';
      case WalletStatus.PENDING:
        return 'text-yellow-500';
      case WalletStatus.BLOCKED:
        return 'text-gray-500';
      default:
        return '';
    }
  }
  getStatusText(status: WalletStatus): string {
    switch (status) {
      case WalletStatus.ACTIVE:
        return 'Active';
      case WalletStatus.INACTIVE:
        return 'Inactive';
      case WalletStatus.PENDING:
        return 'Pending';
      case WalletStatus.BLOCKED:
        return 'Blocked';
      default:
        return '';
    }
  }
  getStatusIcon(status: WalletStatus): string {
    switch (status) {
      case WalletStatus.ACTIVE:
        return '✅';
      case WalletStatus.INACTIVE:
        return '❌';
      case WalletStatus.PENDING:
        return '⏳';
      case WalletStatus.BLOCKED:
        return '🔒';
      default:
        return '';
    }
  }
  getPageNumbers(): number[] {
  const pagesToShow = 3; // Number of pages to show around current page
  const pages: number[] = [];
  
  // Always show first page
  if (this.currentPage > pagesToShow + 1) {
    pages.push(1);
    if (this.currentPage > pagesToShow + 2) {
      pages.push(-1); // Ellipsis
    }
  }
  
  // Show pages around current page
  const start = Math.max(2, this.currentPage - pagesToShow);
  const end = Math.min(this.totalPages - 1, this.currentPage + pagesToShow);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  // Always show last page
  if (this.currentPage < this.totalPages - pagesToShow) {
    if (this.currentPage < this.totalPages - pagesToShow - 1) {
      pages.push(-1); // Ellipsis
    }
    pages.push(this.totalPages);
  }
  
  return pages;
}
// Method to calculate active wallet count
getActiveWalletCount(): number {
  return this.users.filter(user => user.wallet?.status === 'ACTIVE').length;
}

// Add this method to the UsersComponent class
getInactiveWalletCount(): number {
  return this.users.filter(user => user.wallet?.status === 'INACTIVE').length;
}
// Add the missing method to calculate admin user count
getAdminUserCount(): number {
  return this.users.filter(user => user.roles.some(role => role.name === 'ADMIN')).length;
}
 // Add this method to your component class
  calculateMinValue(currentPage: number, itemsPerPage: number, totalItems: number): number {
    return Math.min(currentPage * itemsPerPage, totalItems);
  }
}