import { Injectable } from "@angular/core";
import { Subject, Observable, EMPTY, of } from "rxjs";
import { TeamSignUpForm } from "../../models/team/team-sign-up-form.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { switchMap, tap, catchError } from "rxjs/operators";
import {
  SnackBarService,
  SnackBarEvent
} from "src/app/shared/components/snack-bar/snack-bar-service.service";

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

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService
  ) {}

  newSubmission() {
    this.newTeamSubmissionAction.next(undefined);
  }

  addTeamSignUpForm(newTeamForm: TeamSignUpForm | undefined) {
    this.newTeamSubmissionAction.next(newTeamForm);
  }

  newTeamSubmission$ = this.newTeamSubmissionAction.asObservable().pipe(
    switchMap((newTeamSubmission: TeamSignUpForm) => {
      if (newTeamSubmission == undefined) {
        return of(undefined);
      }
      return this.addTeamSignUpFormAsync(newTeamSubmission);
    })
  );

  addTeamSignUpFormAsync(
    newTeamForm: TeamSignUpForm
  ): Observable<TeamSignUpForm> {
    return this.http
      .post<TeamSignUpForm>(
        "team/signup",
        JSON.stringify(newTeamForm),
        this.headers
      )
      .pipe(
        catchError(_ => {
          this.snackBarService.openSnackBarFromComponent(
            "Error occured while submitting the request",
            "Dismiss",
            SnackBarEvent.Error
          );
          return of(undefined);
        })
      );
  }
}
