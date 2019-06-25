import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { TeamSignUpForm } from "../../models/team/team-sign-up-form.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class TeamService {
  headers = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };
  private newTeamSubmissionAction: Subject<TeamSignUpForm> = new Subject<
    TeamSignUpForm
  >();

  constructor(private http: HttpClient) {}

  addTeamSignUpForm(newTeamForm: TeamSignUpForm) {
    this.newTeamSubmissionAction.next(newTeamForm);
    // this.http
    //   .post<TeamSignUpForm>(
    //     "team/signup",
    //     JSON.stringify(newTeamForm),
    //     this.headers
    //   )
    //   .subscribe(_ => console.log("results are", _));
  }

  newTeamSubmission$ = this.newTeamSubmissionAction.asObservable().pipe(
    switchMap((newTeamSubmission: TeamSignUpForm) => {
      return this.addTeamSignUpFormAsync(newTeamSubmission);
    })
  );

  addTeamSignUpFormAsync(
    newTeamForm: TeamSignUpForm
  ): Observable<TeamSignUpForm> {
    return this.http.post<TeamSignUpForm>(
      "team/signup",
      JSON.stringify(newTeamForm),
      this.headers
    );
  }
}
