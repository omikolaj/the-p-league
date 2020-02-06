import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import LeagueSessionSchedule from '../../models/schedule/classes/league-session-schedule.model';
import { League } from '../../models/schedule/league.model';
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
		const eTag = localStorage.getItem('eTag');
		const header = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		if (eTag) {
			header.headers.append('If-None-Match', eTag);
		}

		return this.http.get<LeagueSessionSchedule[]>(this.sessionSchedulesUrl, header);
	}

	fetchLeagueByID(leagueID: string): Observable<League> {
		return this.http.get<League>(`leagues/${leagueID}`, this.headers);
	}
}
