import { Component } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { TeamSignUpImages, TeamSignUpImage } from "./team-signup-images";
import { ROUTE_ANIMATIONS_ELEMENTS } from "src/app/core/animations/route.animations";
import { TeamService } from "src/app/core/services/team/team.service";
import { TeamSignUpForm } from "src/app/core/models/team/team-sign-up-form.model";

@Component({
  selector: "app-team-signup-form",
  templateUrl: "./team-signup-form.component.html",
  styleUrls: ["./team-signup-form.component.scss"]
})
export class TeamSignupFormComponent {
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

  newTeamSubmission$;

  constructor(private fb: FormBuilder, private teamService: TeamService) {}

  onSubmit() {
    const teamSignUpForm: TeamSignUpForm = {
      name: this.contactForm.value.teamName,
      contact: {
        firstName: this.contactForm.value.firstName,
        lastName: this.contactForm.value.lastName,
        phoneNumber: this.contactForm.value.phoneNumber,
        email: this.contactForm.value.email
      }
    };
    this.teamService.addTeamSignUpForm(teamSignUpForm);
  }
}
