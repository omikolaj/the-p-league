import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Role } from 'src/app/shared/helpers/constants/the-p-league-constants';

@Injectable()
export class AdminAuthGuard implements CanActivate {
	isAdmin = false;

	constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
		// endpoint users/<user-id>/roles is an authorized route. User has to be logged in to retrieve user roles
		if (this.authService.currentUserId === null) return this.router.parseUrl('admin/login');
		return this.http.get<string[]>(`users/${this.authService.currentUserId}/roles`).pipe(
			map((roles) => {
				if (this.authService.isLoggedIn) {
					return roles.includes(Role.Admin);
				} else {
					return this.router.parseUrl('admin/login');
				}
			})
		);
	}
}
