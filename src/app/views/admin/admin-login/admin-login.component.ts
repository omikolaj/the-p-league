import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Admin } from "src/app/core/models/user-base.model";
import { AdminService } from "src/app/core/services/admin/admin.service";

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
    const admin: Admin = {
      username: this.adminLoginForm.value.username,
      password: this.adminLoginForm.value.password
    };
    this.adminService.authenticate(admin);
  }
}
