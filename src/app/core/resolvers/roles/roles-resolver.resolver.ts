import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { share, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
	providedIn: 'root'
})
export class RolesResolver implements Resolve<Observable<string[]>> {
	constructor(private http: HttpClient, private authService: AuthService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
		if (this.authService.wasLoggedIn) {
			if (!this.authService.isLoggedIn) {
				return this.authService.refreshToken().pipe(
					switchMap((_) => {
						return this.http.get<string[]>(`users/${this.authService.currentUserId}/roles`).pipe(share());
					})
				);
			} else {
				return this.http.get<string[]>(`users/${this.authService.currentUserId}/roles`).pipe(share());
			}
		}
		// if user is not logged in return empty array of 'roles'
		return [];
	}
}
