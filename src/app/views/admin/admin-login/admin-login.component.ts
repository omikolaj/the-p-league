import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormControl,
  FormGroupDirective,
  NgForm
} from "@angular/forms";
import { Admin } from "src/app/core/models/user/user-base.model";
import { AdminService } from "src/app/core/services/admin/admin.service";
import { Auth } from "src/app/core/models/auth/auth.model";
import { Login } from "src/app/core/models/auth/login.model";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { Router } from "@angular/router";
import { ErrorStateMatcher } from "@angular/material";
import { BehaviorSubject, Subscription, throwError, of } from "rxjs";
import { switchMap } from "rxjs/internal/operators/switchMap";
import { map, tap, catchError } from "rxjs/operators";
import {
  SnackBarService,
  SnackBarEvent
} from "src/app/shared/components/snack-bar/snack-bar-service.service";
import { handleError } from "src/app/helpers/handleError";
import { ErrorCodes } from "src/app/helpers/Constants/ThePLeagueConstants";

@Component({
  selector: "app-admin-login",
  templateUrl: "./admin-login.component.html",
  styleUrls: ["./admin-login.component.scss"]
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  adminLoginForm: FormGroup = this.fb.group({
    username: this.fb.control("oski", Validators.required),
    password: this.fb.control("password", Validators.required),
    newPassword: this.fb.control(null),
    changePassword: this.fb.control(false)
  });
  changePassword: boolean = false;
  adminLockImgSrc: string = "../../../../assets/admin_lock.png";
  subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackBarService
  ) {}

  ngOnInit() {
    this.formControlValueChanged();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  formControlValueChanged() {
    const newPasswordControl = this.adminLoginForm.get("newPassword");
    this.subscription = this.adminLoginForm
      .get("changePassword")
      .valueChanges.subscribe((changePassword: boolean) => {
        if (changePassword) {
          newPasswordControl.setValidators([Validators.required]);
        } else if (!changePassword) {
          newPasswordControl.clearValidators();
        }
        newPasswordControl.updateValueAndValidity();
      });
  }

  onSubmit() {
    const admin: Login = {
      username: this.adminLoginForm.value.username,
      password: this.adminLoginForm.value.password,
      newPassword: this.changePassword
        ? this.adminLoginForm.value.newPassword
        : null,
      admin: true
    };
    if (this.changePassword) {
      this.updateAdminPassword(admin);
    } else {
      this.loginAdmin(admin);
    }
  }

  updateAdminPassword(admin: Login) {
    this.subscription.add(
      this.authService
        .updatePassword(admin)
        .pipe(
          tap(_ =>
            this.snackBar.openSnackBarFromComponent(
              "Password Successfully Updated",
              "Dismiss",
              SnackBarEvent.Success
            )
          ),
          catchError(err => handleError(err, this.snackBar))
        )
        .subscribe(_ => {
          this.adminLoginForm
            .get("changePassword")
            .setValue((this.changePassword = false));
        })
    );
  }

  loginAdmin(admin: Login) {
    this.subscription.add(
      this.authService
        .authenticate(admin)
        .pipe(catchError(err => handleError(err, this.snackBar)))
        .subscribe(_ => {
          this.router.navigate(["merchandise"]);
        })
    );
  }
}
