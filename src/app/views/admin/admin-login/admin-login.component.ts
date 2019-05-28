import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

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
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}
}
