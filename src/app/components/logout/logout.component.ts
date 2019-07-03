import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { Router } from "@angular/router";
import {
  SnackBarService,
  SnackBarEvent
} from "../../shared/components/snack-bar/snack-bar-service.service";
import { tap, catchError } from "rxjs/operators";
import {
  EventBusService,
  EmitEvent,
  Events
} from "src/app/core/services/event-bus/event-bus.service";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.scss"]
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
        catchError(err => {
          this.eventBus.emit(new EmitEvent(Events.Loading, false));
          console.log("error occured");
          this.location.back();
          this.snackBar.openSnackBarFromComponent(
            "An error occured while logging out",
            "Dismiss",
            SnackBarEvent.Error
          );
          return err;
        }),
        tap(() => this.router.navigate(["about"])),
        tap(loggedOut => {
          this.eventBus.emit(new EmitEvent(Events.Loading, false));
          this.snackBar.openSnackBarFromComponent(
            "You have successfully logged out",
            "Dismiss",
            SnackBarEvent.Success
          );
        })
      )
      .subscribe();
  }
}
