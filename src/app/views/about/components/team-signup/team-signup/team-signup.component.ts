import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { TeamSignUpImage, TeamSignUpImages } from "../team-signup-images";
import { TeamService } from "src/app/core/services/team/team.service";
import { TeamSignUpForm } from "src/app/core/models/team/team-sign-up-form.model";
import { map } from "rxjs/operators";

@Component({
  selector: "app-team-signup",
  templateUrl: "./team-signup.component.html",
  styleUrls: ["./team-signup.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamSignupComponent implements OnInit {
  images: TeamSignUpImage[] = TeamSignUpImages;
  teamSignUpForm: TeamSignUpForm | {};

  teamSignUpSubmitted$ = this.teamService.newTeamSubmission$.pipe(
    map(form => {
      if (form === undefined) {
        return form;
      }
      return (this.teamSignUpForm = form);
    })
  );

  constructor(private teamService: TeamService) {}

  ngOnInit() {}
}
