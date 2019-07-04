import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  OnInit,
  OnDestroy
} from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ROUTE_ANIMATIONS_ELEMENTS } from "src/app/core/animations/route.animations";
import { TeamService } from "src/app/core/services/team/team.service";
import { TeamSignUpForm } from "src/app/core/models/team/team-sign-up-form.model";
import { TeamSignUpImage, TeamSignUpImages } from "../team-signup-images";
import {
  trigger,
  transition,
  query,
  style,
  animate,
  state
} from "@angular/animations";
import {
  EventBusService,
  Events
} from "src/app/core/services/event-bus/event-bus.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-team-signup-form",
  templateUrl: "./team-signup-form.component.html",
  styleUrls: ["./team-signup-form.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("infoAnimation", [
      transition("* => *", [
        query(".form-wrapper", [
          style({ opacity: 0, transform: "translateY(-3%)" }),
          animate(
            ".3s cubic-bezier(0.35, 0, 0.25, 1)",
            style({ opacity: 1, transform: "translateY(0%)" })
          )
        ])
      ])
    ])
  ]
})
export class TeamSignupFormComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  submitted: string = "not-submitted";
  @HostBinding("@infoAnimation")
  public animagePage = true;
  teamSignUpSuccess: boolean = false;
  contactForm: FormGroup = this.fb.group({
    teamName: this.fb.control("Broskars", Validators.required),
    firstName: this.fb.control("Ed", Validators.required),
    lastName: this.fb.control("Truck", Validators.required),
    phoneNumber: this.fb.control("2163943502", [
      Validators.required,
      Validators.pattern("[0-9]{0,10}")
    ]),
    email: this.fb.control("oski@gmail.com", [
      Validators.required,
      Validators.email
    ]),
    preferredContact: this.fb.control(1)
  });
  isLoading: boolean = false;
  subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private eventbus: EventBusService
  ) {}

  ngOnInit(): void {
    this.subscription = this.eventbus.on(
      Events.Loading,
      isLoading => (this.isLoading = isLoading)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const teamSignUpForm: TeamSignUpForm = {
      name: this.contactForm.value.teamName,
      contact: {
        firstName: this.contactForm.value.firstName,
        lastName: this.contactForm.value.lastName,
        phoneNumber: this.contactForm.value.phoneNumber,
        email: this.contactForm.value.email,
        preferredContact: this.contactForm.value.preferredContact
      }
    };
    this.submitted = "submitted";
    this.teamService.addTeamSignUpForm(teamSignUpForm);
  }
}
