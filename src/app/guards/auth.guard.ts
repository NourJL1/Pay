import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const rolesString = localStorage.getItem('roles') || '';
    // On considère que rolesString est une chaîne de rôles séparés par des virgules
    const roles = rolesString.split(',').map(r => r.trim());

    const requiredRole = route.data['role'] as string;

    // Check if user roles contain or are higher than required role
    const hasRole = roles.some(userRole => this.isRoleHierarchical(userRole, requiredRole));

    if (hasRole) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  private isRoleHierarchical(userRole: string, requiredRole: string): boolean {
    const roleHierarchy = ['ROLE_USER', 'ROLE_MANAGER', 'ROLE_ADMIN'];

    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

    return userRoleIndex >= requiredRoleIndex;
  }
  
}
