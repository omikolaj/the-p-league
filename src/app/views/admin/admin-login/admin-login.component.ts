import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Login } from 'src/app/core/models/auth/login.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { handleError } from 'src/app/helpers/handleError';
import { SnackBarEvent, SnackBarService } from 'src/app/shared/components/snack-bar/snack-bar-service.service';

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
	loading = false;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private snackBar: SnackBarService,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.formControlValueChanged();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	formControlValueChanged(): void {
		const newPasswordControl = this.adminLoginForm.get('newPassword');
		this.subscription = this.adminLoginForm.get('changePassword').valueChanges.subscribe((changePassword: boolean) => {
			if (changePassword) {
				newPasswordControl.setValidators([Validators.required]);
			} else if (!changePassword) {
				newPasswordControl.clearValidators();
			}
			newPasswordControl.updateValueAndValidity();
		});
	}

	onSubmit(): void {
		const admin: Login = {
			username: this.adminLoginForm.value.username,
			password: this.adminLoginForm.value.password,
			newPassword: this.changePassword ? this.adminLoginForm.value.newPassword : null,
			admin: true
		};
		if (this.changePassword) {
			this.updateAdminPassword(admin);
		} else {
			this.loginAdmin(admin);
		}
	}

	updateAdminPassword(admin: Login): void {
		this.subscription.add(
			this.authService
				.updatePassword(admin)
				.pipe(
					tap((_) => this.snackBar.openSnackBarFromComponent('Password Successfully Updated', 'Dismiss', SnackBarEvent.Success)),
					catchError((err) => handleError(err, this.snackBar))
				)
				.subscribe((_) => {
					this.adminLoginForm.get('changePassword').setValue((this.changePassword = false));
				})
		);
	}

	loginAdmin(admin: Login): void {
		// this.eventBus.emit(new EmitEvent(Events.Loading, true))
		this.loading = true;
		this.subscription.add(
			this.authService
				.authenticate(admin)
				.pipe(
					catchError((err) => {
						// this.eventBus.emit(new EmitEvent(Events.Loading, false))
						this.loading = false;
						return handleError(err, this.snackBar);
					})
				)
				.subscribe(
					(_) => {
						this.router.navigate(['dashboard'], { relativeTo: this.activatedRoute.parent });
						this.snackBar.openSnackBarFromComponent('Successfully logged in', 'Dismiss', SnackBarEvent.Success);
					},
					(err) => {
						handleError(err, this.snackBar);
					},
					() => {
						// this.eventBus.emit(new EmitEvent(Events.Loading, false))
						this.loading = false;
					}
				)
		);
	}
}
