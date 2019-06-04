import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Login } from "../../models/auth/login.model";
import { Observable, of, BehaviorSubject } from "rxjs";
import { tap, map } from "rxjs/operators";
import * as moment from "moment";
import * as jwt_decode from "jwt-decode";
import { JwtPayload } from "../../models/auth/token/JwtPayload.model";
import { LOCAL_STORAGE_ITEM } from "src/app/helpers/Constants/ThePLeagueConstants";
import { LocalStorageItem } from "../../models/storage/local-storage.model";
import { ApplicationToken } from "../../models/auth/token/ApplicationToken.model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  headers = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  isAdministrator$: Observable<boolean>;
  isAdministrator: boolean;

  constructor(private http: HttpClient) {}

  authenticate(user: Login): Observable<ApplicationToken> {
    // http request to authenticate admin
    return this.http
      .post<ApplicationToken>("login", JSON.stringify(user), this.headers)
      .pipe(
        map(appToken => {
          return this.setSession(appToken);
        })
      );
  }

  logout(): Observable<boolean> {
    return this.http.delete<boolean>("logout").pipe(
      map(res => {
        localStorage.removeItem(LOCAL_STORAGE_ITEM);
        return res;
      })
    );
  }

  refreshToken(): Observable<ApplicationToken> {
    return this.http.get<ApplicationToken>("token/refresh").pipe(
      map(appToken => {
        console.log("Setting session. Token: ", appToken);
        return this.setSession(appToken);
      })
    );
  }

  private setSession(appToken: ApplicationToken): ApplicationToken {
    // Since we are setting new session, remove previous object from storage
    // and re-set it
    localStorage.removeItem(LOCAL_STORAGE_ITEM);

    const expiresAt = moment().add(appToken.expires_in, "seconds");
    console.log(new Date(expiresAt.valueOf()));
    const jwtPayload: JwtPayload = this.decodeJwt(appToken.access_token);
    const localStorageItem: LocalStorageItem = {
      sub: jwtPayload.sub,
      id: jwtPayload.id,
      expires_at: JSON.stringify(expiresAt.valueOf())
    };
    const localStorageItemJSON: string = JSON.stringify(localStorageItem);
    localStorage.setItem(LOCAL_STORAGE_ITEM, localStorageItemJSON);

    return appToken;
  }

  get currentUserId(): string {
    const storageItem: LocalStorageItem = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_ITEM)
    ) as LocalStorageItem;
    return storageItem.id;
  }

  // We have to make backend request to see if user is an admin
  get isAdmin(): Observable<boolean> {
    if (this.isAdministrator) {
      return of(this.isAdministrator);
    } else {
      this.http
        .get<boolean>("is-admin")
        .pipe(map(isAdmin => (this.isAdministrator = isAdmin)));
    }
  }

  get isLoggedOut(): boolean {
    return !this.isLoggedIn;
  }

  get isLoggedIn(): boolean {
    console.log("Is logged in ", moment().isBefore(this.getExpiration));
    return moment().isBefore(this.getExpiration);
  }

  get getExpiration() {
    const localStorageItem: LocalStorageItem = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_ITEM)
    ) as LocalStorageItem;
    const expiration = JSON.parse(localStorageItem.expires_at);
    return moment(expiration);
  }

  private decodeJwt(jwt: string): JwtPayload {
    try {
      return jwt_decode(jwt) as JwtPayload;
    } catch (error) {
      console.log("[ERROR WHILE DECODING TOKEN]", jwt);
      return null;
    }
  }
}
