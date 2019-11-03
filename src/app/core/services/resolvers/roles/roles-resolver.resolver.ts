import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { shareReplay, share, switchMap, tap } from 'rxjs/operators';
import { Role } from 'src/app/helpers/Constants/ThePLeagueConstants';

@Injectable({
  providedIn: 'root'
})
export class RolesResolver implements Resolve<Observable<string[]>> {
  constructor(private http: HttpClient, private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    if (this.authService.wasLoggedIn) {
      if (!this.authService.isLoggedIn) {
        return this.authService.refreshToken().pipe(
          switchMap(_ => {
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
