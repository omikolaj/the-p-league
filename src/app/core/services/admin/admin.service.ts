import { Injectable } from "@angular/core";
import { Admin } from "../../models/user-base.model";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Auth, Jwt } from "../../models/auth.model";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AdminService {
  headers = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };
  constructor(private http: HttpClient) {}

  authenticate(admin: Auth): Observable<Jwt> {
    // http request to authenticate admin
    return this.http
      .post<Jwt>("admin/login", JSON.stringify(admin), this.headers)
      .pipe(tap(res => console.log(res)));
  }
}
