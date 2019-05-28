import { Injectable } from "@angular/core";
import { Admin } from "../../models/user-base.model";

@Injectable({
  providedIn: "root"
})
export class AdminService {
  constructor() {}

  authenticate(admin: Admin) {
    // http request to authenticate admin
  }
}
