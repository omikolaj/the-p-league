import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { EmitEvent } from 'src/app/core/services/event-bus/EmitEvent';
import { EventBusService, Events } from 'src/app/core/services/event-bus/event-bus.service';
import { SnackBarEvent, SnackBarService } from 'src/app/shared/components/snack-bar/snack-bar-service.service';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
	constructor(
		private authService: AuthService,
		private router: Router,
		private snackBar: SnackBarService,
		private eventBus: EventBusService,
		private location: Location
	) {}

	ngOnInit() {
		this.eventBus.emit(new EmitEvent(Events.Loading, true));
		this.authService
			.logout()
			.pipe(
				catchError((err) => {
					this.eventBus.emit(new EmitEvent(Events.Loading, false));
					this.location.back();
					this.snackBar.openSnackBarFromComponent('An error occured while logging out', 'Dismiss', SnackBarEvent.Error);
					return err;
				}),
				tap(() => this.router.navigate(['about'])),
				tap((loggedOut) => {
					this.eventBus.emit(new EmitEvent(Events.Loading, false));
					this.snackBar.openSnackBarFromComponent('You have successfully logged out', 'Dismiss', SnackBarEvent.Success);
				})
			)
			.subscribe();
	}
}
