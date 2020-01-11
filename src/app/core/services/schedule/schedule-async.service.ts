import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import LeagueSessionSchedule from '../../models/schedule/classes/league-session-schedule.model';
import { LeagueDTO } from '../../models/schedule/league.model';
import { ScheduleBaseAsyncService } from './schedule-administration/schedule-base-async.service';

@Injectable({
	providedIn: 'root'
})
export class ScheduleAsyncService extends ScheduleBaseAsyncService {
	protected readonly sessionSchedulesUrl = 'schedules/sessions';
	protected headers = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json'
		})
	};

	constructor(protected http: HttpClient) {
		super(http);
	}

	fetchLeaguesSessionSchedules(): Observable<LeagueSessionSchedule[]> {
		return this.http.get<LeagueSessionSchedule[]>(this.sessionSchedulesUrl, this.headers);
	}

	fetchLeagueByID(leagueID: string): Observable<LeagueDTO> {
		return this.http.get<LeagueDTO>(`/leagues/${leagueID}`, this.headers);
	}
}
