import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActiveSessionInfo } from 'src/app/core/models/schedule/active-session-info.model';
import Match from 'src/app/core/models/schedule/classes/match.model';
import LeagueSessionSchedule from 'src/app/core/models/schedule/league-session-schedule.model';
import { League } from 'src/app/core/models/schedule/league.model';
import { SportType } from 'src/app/core/models/schedule/sport-type.model';
import { Team, TeamDTO } from 'src/app/core/models/schedule/team.model';
import { ScheduleBaseAsyncService } from './schedule-base-async.service';

@Injectable({
	providedIn: 'root'
})
export class ScheduleAdministrationAsyncService extends ScheduleBaseAsyncService {
	protected readonly leaguesUrl = 'leagues';
	protected readonly teamsUrl = 'teams';
	protected readonly schedulesUrl = 'schedules';
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
		// console.log('publishing newSessions');
		// return of(true).pipe(delay(1000));
		return this.http.post<boolean>(`${this.leaguesUrl}/sessions`, JSON.stringify(newSessions), this.headers);
	}

	fetchActiveSessionsInfo(leaguesIDs: string[]): Observable<ActiveSessionInfo[]> {
		return this.http.post<ActiveSessionInfo[]>(`${this.leaguesUrl}/sessions/active-sessions-info`, JSON.stringify(leaguesIDs), this.headers);
	}

	// #endregion

	// #region SportType

	addSport(newSportType: SportType): Observable<SportType> {
		return this.http.post<SportType>(`${this.sportTypeUrl}`, JSON.stringify(newSportType), this.headers);
	}

	updateSportType(updatedSportType: SportType): Observable<SportType> {
		return this.http.patch<SportType>(`${this.sportTypeUrl}/${updatedSportType.id}`, JSON.stringify(updatedSportType), this.headers);
	}

	deleteSportType(id: string): Observable<boolean> {
		return this.http.delete<boolean>(`${this.sportTypeUrl}/${id}`);
	}

	// #endregion

	// #region League

	addLeague(newLeague: League): Observable<League> {
		return this.http.post<League>(`${this.leaguesUrl}`, JSON.stringify(newLeague), this.headers);
	}

	updateLeagues(updatedLeagues: League[]): Observable<League[]> {
		const options = {
			headers: this.headers.headers,
			body: updatedLeagues
		};
		return this.http.patch<League[]>(this.leaguesUrl, JSON.stringify(updatedLeagues), options);
	}

	deleteLeagues(leaguesToDelete: string[]): Observable<boolean> {
		const options = {
			headers: this.headers.headers,
			body: leaguesToDelete
		};
		return this.http.delete<boolean>(this.leaguesUrl, options);
	}

	// #endregion

	// #region Teams

	addTeam(newTeam: Team): Observable<Team> {
		return this.http.post<Team>(`${this.teamsUrl}`, JSON.stringify(newTeam), this.headers);
	}

	updateTeams(updatedTeams: Team[]): Observable<Team[]> {
		const options = {
			headers: this.headers.headers,
			body: updatedTeams
		};
		return this.http.patch<Team[]>(this.teamsUrl, JSON.stringify(updatedTeams), options);
	}

	fetchUnassignedTeams(): Observable<Team[]> {
		return this.http.get<TeamDTO[]>(`${this.teamsUrl}/unassigned`);
	}

	unassignTeams(teamsToUnassign: string[]): Observable<string[]> {
		return this.http.post<string[]>(`${this.teamsUrl}/unassign`, JSON.stringify(teamsToUnassign), this.headers);
	}

	assignTeams(teamsToAssign: Team[]): Observable<Team[]> {
		return this.http.post<TeamDTO[]>(`${this.teamsUrl}/assign`, JSON.stringify(teamsToAssign), this.headers);
	}

	deleteTeams(teamsToDelete: string[]): Observable<boolean> {
		const options = {
			headers: this.headers.headers,
			body: teamsToDelete
		};
		return this.http.delete<boolean>(this.teamsUrl, options);
	}

	// #endregion
}
