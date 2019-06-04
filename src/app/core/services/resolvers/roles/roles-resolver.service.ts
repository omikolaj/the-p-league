import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../../auth/auth.service";

@Injectable({
  providedIn: "root"
})
export class RolesResolver implements Resolve<Observable<string[]>> {
  constructor(private http: HttpClient, private authService: AuthService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.http.get<string[]>(
      `users/${this.authService.currentUserId}/roles`
    );
  }
}
