import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy
} from "@angular/core";
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from "@angular/animations";
import { AuthService } from "src/app/core/services/auth/auth.service";
import {
  SnackBarService,
  SnackBarEvent
} from "src/app/shared/components/snack-bar/snack-bar-service.service";
import { Subscription } from "rxjs";
import { subscribeOn } from "rxjs/operators";

@Component({
  selector: "app-sidenav-list",
  templateUrl: "./sidenav-list.component.html",
  styleUrls: ["./sidenav-list.component.scss"],
  animations: [
    trigger("sideNavLink", [
      transition("out => in", [
        query("a", [
          style({ opacity: 0, transform: "translateX(-100%)" }),
          stagger(250, [
            animate(
              ".3s cubic-bezier(.52,-0.21,.29,1.26)",
              style({ opacity: 1, transform: "translateX(0)" })
            )
          ])
        ])
      ])
    ])
  ]
})
export class SidenavListComponent implements OnInit, OnDestroy {
  sideNavAnimationState: string = "out";
  @Output() sideNavClose = new EventEmitter();
  @Input() appTitle: string;
  // logo gets passed in from the toolbar icon that is in the middle.
  @Input() logo: string;
  logo_with_title: string = "../../../../assets/logo_no_title.png";
  sidenavListText: string[] = ["Merchandise", "Gallery"];
  isLoggedIn$ = this.authService.isLoggedIn$;
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSideNavClose(): void {
    this.sideNavClose.emit();
  }

  onSideNavLinkClick() {
    this.onSideNavClose();
  }

  sideNavOpening() {
    console.log("SidenNavOpen");
    this.sideNavAnimationState = "in";
  }

  sideNavClosing() {
    console.log("SidenNavClose");
    this.sideNavAnimationState = "out";
  }
  logout() {
    this.authService.logout().subscribe(
      loggedOut => {
        this.snackBar.openSnackBarFromComponent(
          "You have successfully logged out",
          "Dismiss",
          SnackBarEvent.Success
        );
      },
      err => {
        this.snackBar.openSnackBarFromComponent(
          "An error occured while logging out",
          "Dismiss",
          SnackBarEvent.Error
        );
      }
    );
  }
}
