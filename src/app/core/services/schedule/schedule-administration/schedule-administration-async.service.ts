import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as cuid from 'cuid';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/internal/operators/delay';
import NewSessionSchedule from 'src/app/views/admin/schedule/models/session/new-session-schedule.model';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { Match } from 'src/app/views/schedule/models/interfaces/match.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { ScheduleBaseAsyncService } from './schedule-base-async.service';

@Injectable({
	providedIn: 'root'
})
export class ScheduleAdministrationAsyncService extends ScheduleBaseAsyncService {
	constructor(protected http: HttpClient) {
		super(http);
	}

	// #region Session

	generateSessions(newSessions: NewSessionSchedule[]): Observable<Match[]> {
		console.log('Generating new session', newSessions);
		return of([]);
	}

	// #endregion

	// #region SportType

	addSport(newSportType: SportType): Observable<SportType> {
		newSportType.id = cuid();
		console.log('added new sport to backend', newSportType);
		return of(newSportType).pipe(delay(1000));
	}

	updateSportType(updatedSportType: SportType): Observable<SportType> {
		console.log('updated sport type through the backend', updatedSportType);
		return of(updatedSportType).pipe(delay(100));
	}

	deleteSportType(id: string): Observable<string> {
		return of(id).pipe(delay(100));
	}

	// #endregion

	// #region League

	addLeague(newLeague: League): Observable<League> {
		newLeague.id = cuid();
		console.log('added new league to the backend', newLeague);
		return of(newLeague).pipe(delay(100));
	}

	updateLeagues(updatedLeagues: League[]): Observable<League[]> {
		return of(updatedLeagues).pipe(delay(100));
	}

	deleteLeagues(leaguesToDelete: string[]): Observable<string[]> {
		return of(leaguesToDelete).pipe(delay(100));
	}

	// #endregion

	// #region Teams

	addTeam(newTeam: Team): Observable<Team> {
		newTeam.id = cuid();
		return of(newTeam).pipe(delay(100));
	}

	updateTeams(updatedTeams: Team[]): Observable<Team[]> {
		return of(updatedTeams).pipe(delay(100));
	}

	unassignTeams(teamsToUnassign: string[]): Observable<string[]> {
		return of(teamsToUnassign).pipe(delay(100));
	}

	assignTeams(teamsToAssign: Team[]) {
		return of(teamsToAssign).pipe(delay(100));
	}

	deleteTeams(teamsToDelete: string[]): Observable<string[]> {
		return of(teamsToDelete).pipe(delay(100));
	}

	// #endregion
}
