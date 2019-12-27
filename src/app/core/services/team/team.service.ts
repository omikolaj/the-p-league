import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { SnackBarEvent, SnackBarService } from 'src/app/shared/components/snack-bar/snack-bar-service.service';
import { TeamSignUpForm } from '../../models/team/team-sign-up-form.model';
import { EmitEvent } from '../event-bus/EmitEvent';
import { EventBusService, Events } from '../event-bus/event-bus.service';

@Injectable({
	providedIn: 'root'
})
export class TeamService {
	constructor(private http: HttpClient, private snackBarService: SnackBarService, private eventBus: EventBusService) {}
	headers = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json'
		})
	};
	private newTeamSubmissionAction: Subject<TeamSignUpForm> = new Subject<TeamSignUpForm>();

	newTeamSubmission$ = this.newTeamSubmissionAction.asObservable().pipe(
		switchMap((newTeamSubmission: TeamSignUpForm) => {
			if (newTeamSubmission === undefined) {
				return of(undefined);
			}
			this.eventBus.emit(new EmitEvent(Events.Loading, true));
			return this.addTeamSignUpFormAsync(newTeamSubmission);
		})
	);

	newSubmission() {
		this.newTeamSubmissionAction.next(undefined);
	}

	addTeamSignUpForm(newTeamForm: TeamSignUpForm | undefined) {
		this.newTeamSubmissionAction.next(newTeamForm);
	}

	addTeamSignUpFormAsync(newTeamForm: TeamSignUpForm): Observable<TeamSignUpForm> {
		return this.http.post<TeamSignUpForm>('teams/signup', JSON.stringify(newTeamForm), this.headers).pipe(
			tap(() => this.eventBus.emit(new EmitEvent(Events.Loading, false))),
			catchError((err) => {
				this.eventBus.emit(new EmitEvent(Events.Loading, false));
				this.snackBarService.openSnackBarFromComponent('Error occured sending the request', 'Dismiss', SnackBarEvent.Error);
				return of(undefined);
			})
		);
	}
}
