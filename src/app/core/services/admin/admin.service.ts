import { Injectable } from "@angular/core";
import { Admin } from "../../models/user/user-base.model";
import { HttpHeaders, HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Login } from "../../models/auth/login.model";

@Injectable({
  providedIn: "root"
})
export class AdminService {}
