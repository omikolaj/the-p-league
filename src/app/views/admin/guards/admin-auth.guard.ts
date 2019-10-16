import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { map, shareReplay } from 'rxjs/operators';
import { Role } from 'src/app/helpers/Constants/ThePLeagueConstants';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AdminAuthGuard implements CanActivate { 
  isAdmin: boolean = false;   

  constructor(private authService: AuthService, private router: Router, private http: HttpClient){      
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {    
    // endpoint users/<user-id>/roles is an authorized route. User has to be logged in to retrieve user roles
    if(this.authService.currentUserId === null) return this.router.parseUrl('admin/login');
    return this.http.get<string[]>(`users/${this.authService.currentUserId}/roles`).pipe(
      map(roles => {
        if(this.authService.isLoggedIn){                         
          return roles.includes(Role.Admin);
          }
        else{
            return this.router.parseUrl('admin/login');
          }         
        }
      )      
    )    
  }
}
