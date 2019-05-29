import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Admin } from "src/app/core/models/user-base.model";
import { AdminService } from "src/app/core/services/admin/admin.service";
import { Auth } from "src/app/core/models/auth.model";

@Component({
  selector: "app-admin-login",
  templateUrl: "./admin-login.component.html",
  styleUrls: ["./admin-login.component.scss"]
})
export class AdminLoginComponent implements OnInit {
  adminLoginForm: FormGroup = this.fb.group({
    username: this.fb.control(null, Validators.required),
    password: this.fb.control(null, Validators.required)
  });

  adminLockImgSrc: string = "../../../../assets/admin_lock.png";
  constructor(private fb: FormBuilder, private adminService: AdminService) {}

  ngOnInit() {}

  onSubmit() {
    const admin: Auth = {
      username: this.adminLoginForm.value.username,
      password: this.adminLoginForm.value.password
    };
    console.log("admin service is", this.adminService);
    this.adminService
      .authenticate(admin)
      .subscribe(
        res => console.log("SUCCESS", res),
        err => console.log("Error occured", err)
      );
  }
}
