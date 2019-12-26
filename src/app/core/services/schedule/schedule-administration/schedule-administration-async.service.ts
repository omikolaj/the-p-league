import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as cuid from 'cuid';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/internal/operators/delay';
import Match from 'src/app/core/models/schedule/classes/match.model';
import LeagueSessionSchedule from 'src/app/core/models/schedule/league-session-schedule.model';
import { League } from 'src/app/core/models/schedule/league.model';
import { SportType } from 'src/app/core/models/schedule/sport-type.model';
import { Team } from 'src/app/core/models/schedule/team.model';
import { ScheduleBaseAsyncService } from './schedule-base-async.service';

@Injectable({
	providedIn: 'root'
})
export class ScheduleAdministrationAsyncService extends ScheduleBaseAsyncService {
	protected readonly leaguesURL = 'leagues';
	constructor(protected http: HttpClient) {
		super(http);
	}

	// #region Session

	// TODO currently not in use, consider deleting
	generateSessions(newSessions: LeagueSessionSchedule[]): Observable<Match[]> {
		console.log('Generating new session', newSessions);
		return of([]);
	}

	publishSessions(newSessions: LeagueSessionSchedule[]): Observable<boolean> {
		console.log('publishing newSessions');
		return of(true).pipe(delay(1000));
	}

	// #endregion

	// #region SportType

	addSport(newSportType: SportType): Observable<SportType> {
		return this.http.post<SportType>(this.sportTypeURL, JSON.stringify(newSportType), this.headers);
	}

	updateSportType(updatedSportType: SportType): Observable<SportType> {
		return this.http.patch<SportType>(`${this.sportTypeURL}/${updatedSportType.id}`, JSON.stringify(updatedSportType), this.headers);
	}

	deleteSportType(id: string): Observable<boolean> {
		return this.http.delete<boolean>(`${this.sportTypeURL}/${id}`);
	}

	// #endregion

	// #region League

	addLeague(newLeague: League): Observable<League> {
		return this.http.post<League>(this.leaguesURL, JSON.stringify(newLeague), this.headers);
	}

	updateLeagues(updatedLeagues: League[]): Observable<League[]> {
		return this.http.patch<League[]>(this.leaguesURL, JSON.stringify(updatedLeagues), this.headers);
	}

	deleteLeagues(leaguesToDelete: string[]): Observable<boolean> {
		const options = {
			headers: this.headers.headers,
			body: leaguesToDelete
		};
		return this.http.delete<boolean>(this.leaguesURL, options);
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

	assignTeams(teamsToAssign: Team[]): Observable<Team[]> {
		return of(teamsToAssign).pipe(delay(100));
	}

	deleteTeams(teamsToDelete: string[]): Observable<boolean> {
		return of(true).pipe(delay(100));
	}

	// #endregion
}
