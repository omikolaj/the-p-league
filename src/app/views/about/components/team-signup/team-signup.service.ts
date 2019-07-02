import { Injectable } from "@angular/core";
import { TeamInfo } from "src/app/core/models/team/team-info";
import { Subject, Observable } from "rxjs";
import { FormGroup } from "@angular/forms";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class TeamSignupService {
  teamInfoSubject: Subject<TeamInfo> = new Subject<TeamInfo>();
  teamInfo$: Observable<TeamInfo> = this.teamInfoSubject.asObservable();
  teamInfo;

  constructor() {}

  newTeamRequest(teamInfoForm: FormGroup): Observable<TeamInfo> {
    const teamInfo: TeamInfo = this.mapFormToTeamInfo(teamInfoForm);
    return this.teamInfo$.pipe(
      map(v => {
        console.log("Inside of teamInfo pipe");
        return (this.teamInfo = v);
      })
    );
  }

  mapFormToTeamInfo(teamInfoForm: FormGroup): TeamInfo {
    const teamInfo: TeamInfo = {
      name: teamInfoForm.value.teamName,
      firstName: teamInfoForm.value.firstName,
      lastName: teamInfoForm.value.lastName,
      cell: teamInfoForm.value.phoneNumber,
      email: teamInfoForm.value.email
    };
    console.log("teamInfoObject", teamInfo);
    return teamInfo;
  }
}
