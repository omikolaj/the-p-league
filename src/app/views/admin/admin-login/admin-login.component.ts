import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Admin } from "src/app/core/models/user/user-base.model";
import { AdminService } from "src/app/core/services/admin/admin.service";
import { Auth } from "src/app/core/models/auth/auth.model";
import { Login } from "src/app/core/models/auth/login.model";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin-login",
  templateUrl: "./admin-login.component.html",
  styleUrls: ["./admin-login.component.scss"]
})
export class AdminLoginComponent implements OnInit {
  adminLoginForm: FormGroup = this.fb.group({
    username: this.fb.control("oski", Validators.required),
    password: this.fb.control("password", Validators.required)
  });

  adminLockImgSrc: string = "../../../../assets/admin_lock.png";
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}

  onSubmit() {
    const admin: Login = {
      username: this.adminLoginForm.value.username,
      password: this.adminLoginForm.value.password,
      admin: true
    };

    this.loginAdmin(admin);
  }

  loginAdmin(admin: Login) {
    this.authService.authenticate(admin).subscribe(_ => {
      this.router.navigate(["merchandise"]);
    });
  }
}
