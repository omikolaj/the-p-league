import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Login } from 'src/app/core/models/auth/login.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {
  SnackBarService,
  SnackBarEvent
} from 'src/app/shared/components/snack-bar/snack-bar-service.service';
import { handleError } from 'src/app/helpers/handleError';
import { EmitEvent } from 'src/app/core/services/event-bus/EmitEvent';
import { Events, EventBusService } from 'src/app/core/services/event-bus/event-bus.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  adminLoginForm: FormGroup = this.fb.group({
    username: this.fb.control(null, Validators.required),
    password: this.fb.control(null, Validators.required),
    newPassword: this.fb.control(null),
    changePassword: this.fb.control(false)
  });
  changePassword = false;
  adminLockImgSrc = '../../../../assets/admin_lock.png';
  subscription: Subscription;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackBarService,
    private eventBus: EventBusService
  ) { }

  ngOnInit() {
    this.formControlValueChanged();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  formControlValueChanged() {
    const newPasswordControl = this.adminLoginForm.get('newPassword');
    this.subscription = this.adminLoginForm
      .get('changePassword')
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
              'Password Successfully Updated',
              'Dismiss',
              SnackBarEvent.Success
            )
          ),
          catchError(err => handleError(err, this.snackBar))
        )
        .subscribe(_ => {
          this.adminLoginForm
            .get('changePassword')
            .setValue((this.changePassword = false));
        })
    );
  }

  loginAdmin(admin: Login) {
    // this.eventBus.emit(new EmitEvent(Events.Loading, true))
    this.loading = true;
    this.subscription.add(
      this.authService
        .authenticate(admin)
        .pipe(catchError(err => {
          // this.eventBus.emit(new EmitEvent(Events.Loading, false))
          this.loading = false;
          return handleError(err, this.snackBar);
        }))
        .subscribe(_ => {
          this.router.navigate(['merchandise']);
          this.snackBar.openSnackBarFromComponent(
            "Successfully logged in",
            'Dismiss',
            SnackBarEvent.Success
          );
        },
          (err) => {
            handleError(err, this.snackBar);
          },
          () => {
            // this.eventBus.emit(new EmitEvent(Events.Loading, false))
            this.loading = false;
          })
    );
  }
}
