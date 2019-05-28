import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { TeamSignUpImages, TeamSignUpImage } from "./team-signup-images";
import { ROUTE_ANIMATIONS_ELEMENTS } from "src/app/core/animations/route.animations";
import { Subject, Observable } from "rxjs";
import { TeamInfo } from "src/app/core/models/team-info";
import { TeamSignupService } from "./team-signup.service";
import {
  SnackBarService,
  SnackBarEvent
} from "src/app/shared/components/snack-bar/snack-bar-service.service";

@Component({
  selector: "app-team-signup-form",
  templateUrl: "./team-signup-form.component.html",
  styleUrls: ["./team-signup-form.component.scss"]
})
export class TeamSignupFormComponent implements OnInit, OnDestroy {
  routeAnimations = ROUTE_ANIMATIONS_ELEMENTS;
  contactForm: FormGroup = this.fb.group({
    teamName: this.fb.control(null, Validators.required),
    firstName: this.fb.control(null, Validators.required),
    lastName: this.fb.control(null, Validators.required),
    phoneNumber: this.fb.control(null, [
      Validators.required,
      Validators.pattern("[0-9]{0,10}")
    ]),
    email: this.fb.control(null, [Validators.required, Validators.email])
  });
  images: TeamSignUpImage[] = TeamSignUpImages;

  constructor(
    private fb: FormBuilder,
    private teamSignupService: TeamSignupService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {}

  onSubmit() {}

  onCancel() {}
}
